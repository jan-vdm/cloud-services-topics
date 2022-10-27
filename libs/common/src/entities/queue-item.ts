import { Serializer } from '../serializer';
import { QueueItemType } from '../types';
import { Line } from './line';
import { Machine } from './machine';
import { OrderItem } from './order-item';

export class QueueItem extends Serializer {
  private _line: Line;
  private _machine: Machine;
  private _item: OrderItem;
  private _queuedAt: Date;

  constructor(line: Line, machine: Machine, item: OrderItem, queuedAt: Date) {
    super();
    this._line = line;
    this._machine = machine;
    this._item = item;
    this._queuedAt = queuedAt;
  }

  static fromQueueItemType(queueItemType: QueueItemType): QueueItem {
    const line = Line.fromLineType(queueItemType.line);
    const machine = Machine.fromMachineType(queueItemType.machine);
    const item = OrderItem.fromOrderItemType(queueItemType.item);

    return new QueueItem(line, machine, item, queueItemType.queuedAt);
  }

  static toQueueItemType(queue: QueueItem): QueueItemType {
    return {
      line: Line.toLineType(queue.line),
      machine: Machine.toMachineType(queue.machine),
      item: OrderItem.toOrderItemType(queue.item),
      queuedAt: queue.queuedAt,
    };
  }

  get line() {
    return this._line;
  }

  get machine() {
    return this._machine;
  }

  get item() {
    return this._item;
  }

  get queuedAt() {
    return this._queuedAt;
  }
}
