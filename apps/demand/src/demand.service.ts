import { Injectable } from '@nestjs/common';

import { EVENT_TOPICS, Order } from '@topics/common';
import { MqttService } from '@topics/mqtt';

@Injectable()
export class DemandService {
  constructor(private readonly mqttService: MqttService) {}

  async createDemand(amount: number) {
    const order = Order.fromQuantity(amount);

    console.log(order);
    this.mqttService.publish(EVENT_TOPICS.ORDER_PLACED, order.serialize(), {
      qos: 0,
    });
  }
}
