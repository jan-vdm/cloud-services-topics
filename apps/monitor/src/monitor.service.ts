import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_TOPICS, Order, OrderPendingEvent } from '@topics/common';
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
    this.mqttService.subscribe(
      EVENT_TOPICS.ORDER_PLACED,
      { qos: 0 },
      (topic, payload) =>
        this.orderPlaced(topic, payload, this.prismaService, this.mqttService),
    );
  }

  async orderPlaced(
    topic: string,
    payload: Buffer,
    prismaService,
    mqttService,
  ) {
    console.log(`event topic ${topic} received`);
    const data = Order.deserialize<Order>(payload.toString());

    try {
      const order = await prismaService.order.create({
        data: {
          id: data.id,
        },
      });

      const orderItems = data.items.map((item) => ({
        id: item.id,
        status: item.status,
        orderId: order.id,
      }));

      const result = await prismaService.orderItem.createMany({
        data: orderItems,
      });

      console.log(
        `Created order ${order.id} with ${result.count} number of items`,
      );

      const orderPendingEvent: OrderPendingEvent = {
        order: Order.toOrderType(data),
      };

      mqttService.publish(
        EVENT_TOPICS.ORDER_PENDING,
        JSON.stringify(orderPendingEvent),
      );
    } catch (error) {
      console.error(error);
    }
  }
}
