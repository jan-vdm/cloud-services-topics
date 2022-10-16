import { OrderStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { Serializer } from '../serializer';
import { OrderItemType } from '../types';

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
