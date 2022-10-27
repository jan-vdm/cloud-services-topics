import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EVENT_TOPICS,
  LineUpdateEvent,
  Machine,
  MachineCompletedOrderEvent,
  MachineType,
  MachineUpdateEvent,
  topicExtractor,
} from '@topics/common';
import { MqttService } from '@topics/mqtt';
import { Cache } from '../cache';
import { LinesHelper } from '../lines-helper';

@Injectable()
export class LineService {
  constructor(
    private readonly mqttService: MqttService,
    private readonly linesHelper: LinesHelper,
    private readonly cache: Cache,
  ) {}

  @OnEvent('mqtt_connect')
  mqttConnectEvent() {
    console.log('mqtt has connected');
    this.mqttService.subscribe(
      EVENT_TOPICS.LINE_UPDATE,
      { qos: 0 },
      (topic: string, payload: Buffer) => {
        if (topic.includes('line') && !topic.includes('machine')) {
          this.lineUpdate(topic, payload, this);
        }
      },
    );
    this.mqttService.subscribe(
      EVENT_TOPICS.MACHINE_UPDATE,
      { qos: 0 },
      (topic: string, payload: Buffer) => {
        if (
          topic.includes('line') &&
          topic.includes('machine') &&
          !topic.includes('order')
        ) {
          this.machineUpdate(topic, payload, this);
        }
      },
    );
    this.mqttService.subscribe(
      EVENT_TOPICS.MACHINE_COMPLETED_ORDER,
      { qos: 0 },
      (topic: string, payload: Buffer) => {
        if (
          topic.includes('line') &&
          topic.includes('machine') &&
          topic.includes('order') &&
          topic.includes('complete')
        ) {
          this.lineMachineComplete(topic, payload, this);
        }
      },
    );
  }

  async lineUpdate(topic: string, payload: Buffer, service: LineService) {
    try {
      console.log(topic, payload.toString());
      const data: LineUpdateEvent = JSON.parse(payload.toString());

      service.createOrUpdateLine(data.id, data.machines);
    } catch (error) {
      console.error(error);
    }
  }

  async machineUpdate(topic: string, payload: Buffer, service: LineService) {
    try {
      console.log(topic, payload.toString());
      const parsedData = JSON.parse(payload.toString());
      const data: MachineUpdateEvent = {
        id: parsedData.id,
        state: parsedData.state,
        orderId: parsedData.orderId,
      };

      console.log('machine update data', data);
      const extractedTopic = topicExtractor(topic);
      console.log('machine update extractedTopic', extractedTopic);

      const machine = service.cache.getMachine(
        extractedTopic.lineId,
        extractedTopic.machineId,
      );

      console.log('machine machine', machine);

      if (machine) {
        machine.updateState = data.state;
        console.log('checketh hereth', machine);
        service.cache.saveMachine(
          extractedTopic.lineId,
          extractedTopic.machineId,
          machine,
        );

        if (machine.state === 'IDLE') {
          console.log('is idling');
        }

        if (machine.state === 'BROKEN') {
          console.info('is broken');
          const brokenLine = service.cache.getLine(extractedTopic.lineId);
          const sortedBrokenMachines = brokenLine.machines.sort(
            (a, b) => a.id - b.id,
          );
          const firstBrokenMachine = sortedBrokenMachines[0];

          for (const brokenLineMachine of sortedBrokenMachines) {
            const queue = service.cache.getQueue(
              extractedTopic.lineId,
              brokenLineMachine.id,
            );
            for (let i = 0; i < queue.length; i++) {
              const queueItem = service.cache.popFromQueue(
                extractedTopic.lineId,
                brokenLineMachine.id,
              );

              const orderQueuedTopic =
                EVENT_TOPICS.MACHINE_REMOVED_ORDER.split('+');
              const queuedTopic = `${orderQueuedTopic[0]}${queueItem.line.id}${orderQueuedTopic[1]}${queueItem.machine.id}${orderQueuedTopic[2]}${queueItem.item.id}${orderQueuedTopic[3]}`;
              service.mqttService.publish(queuedTopic, queueItem.item.id, {
                qos: 0,
              });

              const line = service.linesHelper.getLineWithLeastNumberOfItems();
              const sortedMachines = line.machines.sort((a, b) => a.id - b.id);
              if (
                sortedMachines.length > 0 &&
                firstBrokenMachine.id === brokenLineMachine.id
              ) {
                const machine = sortedMachines[0];
                const orderQueuedTopic =
                  EVENT_TOPICS.MACHINE_QUEUED_ORDER.split('+');
                const queuedTopic = `${orderQueuedTopic[0]}${line.id}${orderQueuedTopic[1]}${machine.id}${orderQueuedTopic[2]}${queueItem.item.id}${orderQueuedTopic[3]}`;
                service.mqttService.publish(queuedTopic, queueItem.item.id, {
                  qos: 0,
                });
                service.cache.pushToQueue(line.id, machine.id, queueItem.item);
              }
            }
          }
        }

        if (machine.state === 'WORKING') {
          console.info('is working');
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async lineMachineComplete(
    topic: string,
    _payload: Buffer,
    service: LineService,
  ) {
    console.info(topic);
    const extractedTopic = topicExtractor(topic);
    try {
      console.info(extractedTopic);

      const data: MachineCompletedOrderEvent = {
        lineId: extractedTopic.lineId,
        machineId: extractedTopic.machineId,
        orderId: extractedTopic.orderId,
      };

      console.info(data);

      // assign next order
      const nextMachineId = data.machineId + 1;

      const queueItem = service.cache.popFromQueue(data.lineId, data.machineId);

      const nextMachine = service.cache.getMachine(data.lineId, nextMachineId);

      if (!nextMachine) {
        console.info(`order ${data.orderId} is complete`);
        return;
      }

      const queue = service.cache.getQueue(
        extractedTopic.lineId,
        extractedTopic.machineId,
      );

      if (queue.length > 0) {
        const orderTopic = EVENT_TOPICS.MACHINE_ASSIGN_ORDER.split('+');

        const topic = `${orderTopic[0]}${extractedTopic.lineId}${orderTopic[1]}${extractedTopic.machineId}${orderTopic[2]}${queue[0].item.id}${orderTopic[3]}`;
        service.mqttService.publish(topic, queue[0].item.id, {
          qos: 0,
        });
      }
      const orderQueuedTopic = EVENT_TOPICS.MACHINE_QUEUED_ORDER.split('+');
      const queuedTopic = `${orderQueuedTopic[0]}${data.lineId}${orderQueuedTopic[1]}${nextMachine.id}${orderQueuedTopic[2]}${queueItem.item.id}${orderQueuedTopic[3]}`;
      service.mqttService.publish(queuedTopic, queueItem.item.id, {
        qos: 0,
      });

      service.cache.pushToQueue(data.lineId, nextMachine.id, queueItem.item);

      const orderTopic = EVENT_TOPICS.MACHINE_ASSIGN_ORDER.split('+');

      const topic = `${orderTopic[0]}${queueItem.line.id}${orderTopic[1]}${nextMachine.id}${orderTopic[2]}${queueItem.item.id}${orderTopic[3]}`;
      service.mqttService.publish(topic, queueItem.item.id, {
        qos: 0,
      });
    } catch (error) {
      console.error(error);
    }
  }

  private createOrUpdateLine(lineId: number, machineTypes: MachineType[]) {
    console.log(`createOrUpdate ${lineId}, ${machineTypes.length}`);
    const machines: Machine[] = machineTypes.map((mt) => {
      const mtq: MachineType = {
        id: mt.id,
        lineId: mt.lineId,
        state: mt.state,
        queue: mt.queue ? mt.queue : [],
      };
      return Machine.deserialize(JSON.stringify(mtq));
    });
    let line = this.cache.getLine(lineId);
    if (!line) {
      line = this.cache.createLine(lineId, machines);
    } else {
      line = this.cache.getLine(lineId);
      line.updateMachines(machines);
      this.cache.saveLine(line.id, line);
    }
    return line;
  }
}
