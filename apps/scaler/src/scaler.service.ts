import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_TOPICS, Order, OrderPendingEvent } from '@topics/common';
import { MqttService } from '@topics/mqtt';
import { Cache } from './cache';
import { LinesHelper } from './lines-helper';
@Injectable()
export class ScalerService {
  constructor(
    private readonly mqttService: MqttService,
    private readonly linesHelper: LinesHelper,
    private readonly cache: Cache,
  ) {}

  @OnEvent('mqtt_connect')
  mqttConnectEvent() {
    console.log('mqtt has connected');
    this.mqttService.subscribe(
      EVENT_TOPICS.ORDER_PENDING,
      { qos: 0 },
      (topic, payload) => this.newOrder(topic, payload, this),
    );
  }

  async newOrder(topic: string, payload: Buffer, service: ScalerService) {
    const data = JSON.stringify(
      (JSON.parse(payload.toString()) as OrderPendingEvent).order,
    );
    const order = Order.deserialize<Order>(data);
    console.log(topic, ', data received id:', order.id);

    const line = service.linesHelper.getLineWithLeastNumberOfItems();

    if (!line) {
      return;
    }

    const orderTopic = EVENT_TOPICS.MACHINE_ASSIGN_ORDER.split('+');

    order.items.forEach((item) => {
      const line = service.linesHelper.getLineWithLeastNumberOfItems();
      console.info(line.id);
      const sortedMachines = line.machines.sort((a, b) => a.id - b.id);
      const machine = sortedMachines[0];
      console.log(sortedMachines);

      console.log(
        'The queue is currently, ',
        service.cache.getQueue(line.id, machine.id),
      );
      console.log('The machine is, ', machine);

      if (machine.queue.length === 0) {
        const topic = `${orderTopic[0]}${line.id}${orderTopic[1]}${machine.id}${orderTopic[2]}${item.id}${orderTopic[3]}`;
        service.mqttService.publish(topic, item.id, { qos: 0 });
      }
      const orderQueuedTopic = EVENT_TOPICS.MACHINE_QUEUED_ORDER.split('+');
      const queuedTopic = `${orderQueuedTopic[0]}${line.id}${orderQueuedTopic[1]}${machine.id}${orderQueuedTopic[2]}${item.id}${orderQueuedTopic[3]}`;
      service.mqttService.publish(queuedTopic, item.id, { qos: 0 });

      service.cache.pushToQueue(line.id, machine.id, item);
    });
  }
}
