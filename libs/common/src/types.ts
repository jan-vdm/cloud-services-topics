import { OrderStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

abstract class Serializer {
  serialize(): string {
    return '';
  }
  static deserialize<U>(objectString: string): U {
    return JSON.parse(objectString.toString());
  }
}

export type OrderType = {
  id: string;
  items: OrderItemType[];
};

export type OrderItemType = {
  id: string;
  status: OrderStatus;
};
export class Order extends Serializer {
  private _id: string;
  private _items: OrderItem[];

  constructor(id: string, items: OrderItem[]) {
    super();
    this._id = id;
    this._items = items;
  }

  static fromQuantity(quantity: number): Order {
    return new this(uuidv4(), OrderItem.generateItems(quantity));
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

export class OrderItem extends Serializer {
  private _id: string;
  private _status: OrderStatus;

  constructor(id: string, status: OrderStatus) {
    super();
    this._id = id;
    this._status = status;
  }

  static fromOrderItemType(orderItemType: OrderItemType): OrderItem {
    return new OrderItem(orderItemType.id, orderItemType.status);
  }

  static toOrderItemType(orderItem: OrderItem): OrderItemType {
    return {
      id: orderItem.id,
      status: orderItem.status,
    };
  }

  static generateItems(quantity: number): OrderItem[] {
    const items = [];
    for (let i = 0; i < quantity; i++) {
      items.push(new OrderItem(uuidv4(), OrderStatus.PENDING));
    }
    return items;
  }

  serialize(): string {
    const orderItem: OrderItemType = OrderItem.toOrderItemType(this);
    return JSON.stringify(orderItem);
  }

  static deserialize<T>(objectString: string): T {
    const orderItem = JSON.parse(objectString) as OrderItemType;
    return OrderItem.fromOrderItemType(orderItem) as T;
  }

  get id() {
    return this._id;
  }

  get status() {
    return this._status;
  }

  set updateStatus(newStatus: OrderStatus) {
    this._status = newStatus;
  }
}

export type OrderPendingEvent = {
  order: OrderType;
};

export default { Order, OrderItem };
