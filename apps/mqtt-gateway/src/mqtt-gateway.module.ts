import { Module } from '@nestjs/common';
import { MqttGatewayController } from './mqtt-gateway.controller';
import { MqttGatewayService } from './mqtt-gateway.service';

@Module({
  imports: [],
  controllers: [MqttGatewayController],
  providers: [MqttGatewayService],
})
export class MqttGatewayModule {}
