import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EVENT_TOPICS,
  LineUpdateEvent,
  Machine,
  MachineAssignOrderEvent,
  MachineQueuedOrderEvent,
  MachineRemovedOrderEvent,
  MachineUpdateEvent,
  Order,
  OrderPendingEvent,
  topicExtractor,
} from '@topics/common';
import { MqttService } from '@topics/mqtt';
import { PrismaService } from '@topics/prisma';

@Injectable()
export class MonitorService {
  constructor(
    private readonly mqttService: MqttService,
    private readonly prismaService: PrismaService,
  ) {}

  @OnEvent('mqtt_connect')
  mqttConnectEvent() {
    console.log('mqtt has connected');
    this.mqttService.subscribe(
      EVENT_TOPICS.ORDER_PLACED,
      { qos: 0 },
      (topic, payload) => {
        if (topic === EVENT_TOPICS.ORDER_PLACED) {
          this.orderPlaced(
            topic,
            payload,
            this.prismaService,
            this.mqttService,
          );
        }
      },
    );
    this.mqttService.subscribe(
      EVENT_TOPICS.LINE_UPDATE,
      { qos: 0 },
      (topic, payload) => {
        if (topic.includes('line') && !topic.includes('machine'))
          this.lineUpdate(topic, payload, this);
      },
    );
    this.mqttService.subscribe(
      EVENT_TOPICS.MACHINE_UPDATE,
      { qos: 0 },
      (topic, payload) => {
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
      EVENT_TOPICS.MACHINE_QUEUED_ORDER,
      { qos: 0 },
      (topic, payload) => {
        if (
          topic.includes('line') &&
          topic.includes('machine') &&
          topic.includes('order') &&
          topic.includes('queued')
        ) {
          this.orderQueued(topic, payload, this);
        }
      },
    );
    this.mqttService.subscribe(
      EVENT_TOPICS.MACHINE_REMOVED_ORDER,
      { qos: 0 },
      (topic, payload) => {
        if (
          topic.includes('line') &&
          topic.includes('machine') &&
          topic.includes('order') &&
          topic.includes('removed')
        ) {
          this.orderQueued(topic, payload, this);
        }
      },
    );
    this.mqttService.subscribe(
      EVENT_TOPICS.MACHINE_COMPLETED_ORDER,
      { qos: 0 },
      (topic, payload) => {
        if (
          topic.includes('line') &&
          topic.includes('machine') &&
          topic.includes('order') &&
          topic.includes('complete')
        ) {
          this.orderCompleted(topic, payload, this);
        }
      },
    );
  }

  async orderPlaced(
    topic: string,
    payload: Buffer,
    prismaService,
    mqttService,
  ) {
    console.log(`event topic ${topic} received`);
    const data = Order.deserialize<Order>(payload.toString());

    try {
      const order = await prismaService.order.create({
        data: {
          id: data.id,
        },
      });

      const orderItems = data.items.map((item) => ({
        id: item.id,
        status: item.status,
        orderId: order.id,
      }));

      const result = await prismaService.orderItem.createMany({
        data: orderItems,
      });

      console.log(
        `Created order ${order.id} with ${result.count} number of items`,
      );

      const orderPendingEvent: OrderPendingEvent = {
        order: Order.toOrderType(data),
      };

      mqttService.publish(
        EVENT_TOPICS.ORDER_PENDING,
        JSON.stringify(orderPendingEvent),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async lineUpdate(topic: string, payload: Buffer, service: MonitorService) {
    console.log(`event topic ${topic} received`);

    try {
      const data = JSON.parse(payload.toString()) as LineUpdateEvent;
      console.info(data);
      const machines = data.machines.map((machineType) => {
        machineType.lineId = data.id;
        return Machine.fromMachineType(machineType);
      });
      console.info(machines);
      await service.prismaService.line.upsert({
        create: {
          id: data.id,
        },
        update: {
          id: data.id,
        },
        where: {
          id: data.id,
        },
      });

      await Promise.all(
        machines.map((machine) => {
          console.log(machine);
          return service.prismaService.machine.upsert({
            create: {
              id: machine.id,
              machineState: machine.state,
              lineId: machine.lineId,
            },
            update: {
              machineState: machine.state,
            },
            where: {
              id_lineId: {
                id: machine.id,
                lineId: machine.lineId,
              },
            },
          });
        }),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async orderQueued(topic: string, _payload: Buffer, service: MonitorService) {
    const extractedTopic = topicExtractor(topic);
    console.info(extractedTopic);

    const data: MachineQueuedOrderEvent = {
      lineId: extractedTopic.lineId,
      machineId: extractedTopic.machineId,
      orderId: extractedTopic.orderId,
    };

    try {
      const machine = await service.prismaService.machine.findUnique({
        where: { id_lineId: { id: data.machineId, lineId: data.lineId } },
      });

      console.log(`this is `, data);

      if (machine) {
        await service.prismaService.queueItem.upsert({
          create: {
            itemId: data.orderId,
            lineId: data.lineId,
            machineId: data.machineId,
          },
          update: {},
          where: {
            lineId_machineId_itemId: {
              lineId: data.lineId,
              itemId: data.orderId,
              machineId: data.machineId,
            },
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async orderRemoved(topic: string, _payload: Buffer, service: MonitorService) {
    const extractedTopic = topicExtractor(topic);
    console.info(extractedTopic);

    const data: MachineRemovedOrderEvent = {
      lineId: extractedTopic.lineId,
      machineId: extractedTopic.machineId,
      orderId: extractedTopic.orderId,
    };

    try {
      const machine = await service.prismaService.machine.findUnique({
        where: { id_lineId: { id: data.machineId, lineId: data.lineId } },
      });

      if (machine) {
        await service.prismaService.queueItem.delete({
          where: {
            lineId_machineId_itemId: {
              itemId: data.orderId,
              lineId: data.lineId,
              machineId: data.machineId,
            },
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async orderCompleted(
    topic: string,
    _payload: Buffer,
    service: MonitorService,
  ) {
    const extractedTopic = topicExtractor(topic);
    console.info(extractedTopic);

    const data: MachineAssignOrderEvent = {
      lineId: extractedTopic.lineId,
      machineId: extractedTopic.machineId,
      orderId: extractedTopic.orderId,
    };

    try {
      const machine = await service.prismaService.machine.findUnique({
        where: { id_lineId: { id: data.machineId, lineId: data.lineId } },
      });

      if (machine) {
        await service.prismaService.queueItem.delete({
          where: {
            lineId_machineId_itemId: {
              itemId: data.orderId,
              lineId: data.lineId,
              machineId: data.machineId,
            },
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async machineUpdate(topic: string, payload: Buffer, service: MonitorService) {
    try {
      const parsedPayload = JSON.parse(payload.toString());
      const extractedTopic = topicExtractor(topic);
      const data: MachineUpdateEvent = {
        id: extractedTopic.machineId,
        state: parsedPayload.state,
        orderId: parsedPayload.orderId,
      };
      await service.prismaService.machine.update({
        data: {
          machineState: data.state,
        },
        where: {
          id_lineId: {
            id: data.id,
            lineId: extractedTopic.lineId,
          },
        },
      });
    } catch (err) {
      console.error(err);
    }
  }
}
