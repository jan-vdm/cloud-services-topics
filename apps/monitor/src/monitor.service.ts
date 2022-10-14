import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EVENT_TOPICS,
  Order,
  OrderItem,
  OrderPendingEvent,
} from '@topics/common';
import { MqttService } from '@topics/mqtt';
import { PrismaService } from '@topics/prisma';

@Injectable()
export class MonitorService {
  constructor(
    private readonly mqttService: MqttService,
    private readonly prismaService: PrismaService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  @OnEvent('mqtt_connect')
  mqttConnectEvent() {
    console.log('mqtt has connected');
    this.mqttService.subscribe('order/placed', { qos: 0 }, this.orderPlaced);
  }

  async orderPlaced(topic: string, payload: Buffer) {
    console.log(`event topic ${topic} received`);
    const data = Order.deserialize<Order>(payload.toString());

    try {
      const order = await this.prismaService.order.create({
        data: {
          id: data.id,
        },
      });

      const orderItems = data.items.map((item) => ({
        id: item.id,
        status: item.status,
        orderId: order.id,
      }));

      const result = await this.prismaService.orderItem.createMany({
        data: orderItems,
      });

      console.log(
        `Created order ${order.id} with ${result.count} number of items`,
      );

      const orderPendingEvent: OrderPendingEvent = {
        order: data.serialize(),
      };

      this.mqttService.publish(
        EVENT_TOPICS.ORDER_PENDING,
        JSON.stringify(orderPendingEvent),
      );
    } catch (error) {
      console.error(error);
    }
  }
}
