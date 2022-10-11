import { Injectable } from '@nestjs/common';
import { Order } from '@topics/common';
import { MqttService } from '@topics/mqtt';

@Injectable()
export class DemandService {
  constructor(private mqttService: MqttService) {}
  async createDemand(amount: number) {
    const order: Order = {
      quantity: amount,
    };
    console.log(order);
    this.mqttService.publish('order/placed', JSON.stringify(order), { qos: 0 });
  }
}
