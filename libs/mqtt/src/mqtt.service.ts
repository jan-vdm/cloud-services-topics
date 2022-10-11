import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ClientSubscribeCallback,
  connect,
  IClientPublishOptions,
  MqttClient,
} from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private mqttClient: MqttClient;

  constructor(private readonly eventEmitter: EventEmitter2) {
    this.eventEmitter.emit('mqtt_connect');
  }

  onModuleInit() {
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    const connectUrl = 'mqtt://192.168.1.133:1883';

    this.mqttClient = connect(connectUrl, {
      clientId,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
      clean: true,
    });

    this.mqttClient.on('connect', function () {
      console.info('Connected to CloudMQTT');
    });

    this.mqttClient.on('error', function () {
      console.error('Error in connecting to CloudMQTT');
    });
  }

  publish(
    topic: string,
    message: string | Buffer,
    opts?: IClientPublishOptions,
  ): string {
    console.info(`Publishing to ${topic}`);
    this.mqttClient.publish(topic, message, opts);

    return `Publishing to ${topic}`;
  }

  subscribe(topic: string, callback?: ClientSubscribeCallback) {
    return this.mqttClient.subscribe(topic, callback);
  }
}
