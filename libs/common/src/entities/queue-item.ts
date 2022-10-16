import { Serializer } from '../serializer';
import { QueueItemType } from '../types';
import { Line } from './line';
import { OrderItem } from './order-item';

export class QueueItem extends Serializer {
  private _line: Line;
  private _item: OrderItem;
  private _queuedAt: Date;

  constructor(line: Line, item: OrderItem, queuedAt: Date) {
    super();
    this._line = line;
    this._item = item;
    this._queuedAt = queuedAt;
  }

  static fromQueueItemType(queueItemType: QueueItemType): QueueItem {
    const line = Line.fromLineType(queueItemType.line);
    const item = OrderItem.fromOrderItemType(queueItemType.item);

    return new QueueItem(line, item, queueItemType.queuedAt);
  }

  static toQueueItemType(queue: QueueItem): QueueItemType {
    return {
      line: Line.toLineType(queue.line),
      item: OrderItem.toOrderItemType(queue.item),
      queuedAt: queue.queuedAt,
    };
  }

  get line() {
    return this._line;
  }

  get item() {
    return this._item;
  }

  get queuedAt() {
    return this._queuedAt;
  }
}
