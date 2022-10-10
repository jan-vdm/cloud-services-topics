import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { MqttGatewayModule } from './mqtt-gateway.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(MqttGatewayModule, {
    transport: Transport.MQTT,
    options: {
      url: 'mqtt://localhost:1883',
    },
  });
  await app.listen();
}
bootstrap();
