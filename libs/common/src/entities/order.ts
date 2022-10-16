import { v4 as uuidv4 } from 'uuid';
import { Serializer } from '../serializer';
import { OrderItemType, OrderType } from '../types';
import { OrderItem } from './order-item';

export class Order extends Serializer {
  private _id: string;
  private _items: OrderItem[];

  constructor(id: string, items: OrderItem[]) {
    super();
    this._id = id;
    this._items = items;
  }

  static fromQuantity(quantity: number): Order {
    return new Order(uuidv4(), OrderItem.generateItems(quantity));
  }

  static toOrderType(order: Order): OrderType {
    const orderItems = order.items.map<OrderItemType>((item) =>
      OrderItem.toOrderItemType(item),
    );
    return {
      id: order.id,
      items: orderItems,
    };
  }

  serialize(): string {
    return JSON.stringify(Order.toOrderType(this));
  }

  static deserialize<T>(objectString: string): T {
    const json = JSON.parse(objectString) as OrderType;
    const orderItems = json.items.map((item) =>
      OrderItem.fromOrderItemType(item),
    );
    return new Order(json.id, orderItems) as T;
  }

  get id() {
    return this._id;
  }

  get items() {
    return this._items;
  }
}
