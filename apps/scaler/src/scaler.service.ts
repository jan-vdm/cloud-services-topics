import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_TOPICS, Line, Order } from '@topics/common';
import { MqttService } from '@topics/mqtt';
import { Cache } from './cache';

@Injectable()
export class ScalerService {
  constructor(
    private readonly mqttService: MqttService,
    private readonly cache: Cache,
  ) {}

  @OnEvent('mqtt_connect')
  mqttConnectEvent() {
    console.log('mqtt has connected');
    this.mqttService.subscribe(
      EVENT_TOPICS.ORDER_PENDING,
      { qos: 0 },
      this.newOrder,
    );
  }

  newOrder(topic: string, payload: Buffer) {
    const data = Order.deserialize<Order>(payload.toString());
    console.log(topic, ', data received id:', data.id);

    const line = this.getLineWithLeastNumberOfItems();

    const orderTopic = EVENT_TOPICS.MACHINE_ASSIGN_ORDER.split('+');
    data.items.forEach((item) => {
      line.machines.forEach((machine) => {
        const topic = `${orderTopic[0]}${line.id}${orderTopic[1]}${machine.id}${orderTopic[2]}${data.id}${orderTopic[3]}`;
        this.mqttService.publish(topic, item.id, { qos: 0 });
      });
    });
  }

  private getLineWithLeastNumberOfItems(): Line {
    const lineCounts = this.getLinesQueueItemCount();
    const lineCount = lineCounts.reduce((prev, curr) => {
      if (prev.queueItemCount > curr.queueItemCount) {
        return curr;
      }
      return prev;
    }, undefined);

    return this.cache.getLine(lineCount.lineId);
  }

  private getLinesQueueItemCount(): {
    lineId: number;
    queueItemCount: number;
  }[] {
    console.log(this.cache);
    return this.cache.lines.map((line) => ({
      lineId: line.id,
      queueItemCount: line.queue.length,
    }));
  }
}
