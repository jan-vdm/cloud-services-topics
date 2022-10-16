import { Serializer } from '../serializer';
import { LineType } from '../types';
import { Machine } from './machine';
import { QueueItem } from './queue-item';

export class Line extends Serializer {
  private _id: number;
  private _machines: Machine[];
  private _queue: QueueItem[];

  constructor(id: number, machines: Machine[]);
  constructor(id: number, machines: Machine[], queue: QueueItem[]);
  constructor(id: number, machines: Machine[], queue?: QueueItem[]) {
    super();
    this._id = id;
    this._machines = machines;
    if (queue) {
      this._queue = queue;
    } else {
      this._queue = [];
    }
  }

  static fromLineType(lineType: LineType): Line {
    const machines = lineType.machines.map((machineType) =>
      Machine.fromMachineType(machineType),
    );
    const queue = lineType.queue.map((queueItemType) =>
      QueueItem.fromQueueItemType(queueItemType),
    );
    return new Line(lineType.id, machines, queue);
  }

  static toLineType(line: Line): LineType {
    return {
      id: line.id,
      machines: line.machines,
      queue: line.queue,
    };
  }

  serialize(): string {
    const line: LineType = Line.toLineType(this);
    return JSON.stringify(line);
  }

  static deserialize<T>(lineString: string): T {
    const line = JSON.parse(lineString) as LineType;
    return Line.fromLineType(line) as T;
  }

  get id() {
    return this._id;
  }

  get machines(): Machine[] {
    return this._machines;
  }

  get queue(): QueueItem[] {
    return this._queue;
  }

  pushQueue(queueItem: QueueItem) {
    this._queue.push(queueItem);
  }

  popQueue() {
    this._queue.shift();
  }
}
