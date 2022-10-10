import { Injectable } from '@nestjs/common';

@Injectable()
export class MqttGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
