import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Order } from '@topics/common';
import { MqttService } from '@topics/mqtt';
import { IPublishPacket } from 'mqtt';

@Injectable()
export class ScalerService {
  constructor(private readonly mqttService: MqttService) {}

  @OnEvent('mqtt_connect')
  mqttConnectEvent() {
    console.log('mqtt has connected');
    this.mqttService.subscribe('order/placed', { qos: 0 }, this.orderPlaced);
  }

  orderPlaced(topic: string, payload: Buffer, _packet: IPublishPacket) {
    const data = Order.deserialize<Order>(payload.toString());
    console.log(topic, ', data received id:', data.id);

    // get lines
  }
}
