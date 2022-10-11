import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MqttService } from '@topics/mqtt';

@Injectable()
export class ScalerService {
  constructor(private readonly mqttService: MqttService) {}

  @OnEvent('mqtt_connect')
  onEventMqttConnect() {
    this.mqttService.subscribe('order/placed', this.orderPlaced);
  }

  orderPlaced(data) {
    console.log(data);
  }
}
