import { Controller, Get } from '@nestjs/common';
import { MqttGatewayService } from './mqtt-gateway.service';

@Controller()
export class MqttGatewayController {
  constructor(private readonly mqttGatewayService: MqttGatewayService) {}

  @Get()
  getHello(): string {
    return this.mqttGatewayService.getHello();
  }
}
