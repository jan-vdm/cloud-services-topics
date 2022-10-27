import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  connect,
  IClientPublishOptions,
  IClientSubscribeOptions,
  IPublishPacket,
  MqttClient,
  OnMessageCallback,
} from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private mqttClient: MqttClient;

  constructor(private readonly eventEmitter: EventEmitter2) {
    setTimeout(() => {
      this.eventEmitter.emit('mqtt_connect');
    }, 1000);
  }

  onModuleInit() {
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    this.mqttClient = connect({
      clientId,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
      clean: true,
      host: 'test.mosquitto.org',
      port: 1883,
      protocol: 'mqtt',
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

  subscribe(
    topic: string,
    opts: IClientSubscribeOptions,
    callback?: OnMessageCallback,
  ) {
    console.log(`topic ${topic} has been subscribed to`);
    const client = this.mqttClient.subscribe(topic, opts);
    client.on(
      'message',
      (mTopic: string, payload: Buffer, packet: IPublishPacket) => {
        if (topic === mTopic) {
          callback(mTopic, payload, packet);
        }
        if (
          topic.includes('+') &&
          topic.split('/')[0] === mTopic.split('/')[0]
        ) {
          callback(mTopic, payload, packet);
        }
      },
    );
    return client;
  }
}
