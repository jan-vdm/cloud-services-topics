import { Injectable } from '@nestjs/common';

import { Order } from '@topics/common';
import { MqttService } from '@topics/mqtt';

@Injectable()
export class DemandService {
  constructor(private readonly mqttService: MqttService) {}

  async createDemand(amount: number) {
    const order = Order.fromQuantity(amount);

    console.log(order);
    this.mqttService.publish('order/placed', order.serialize(), { qos: 0 });
  }
}
