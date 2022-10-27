import { MachineState } from '@prisma/client';
import { Serializer } from '../serializer';
import { MachineType } from '../types';
import { QueueItem } from './queue-item';

export class Machine extends Serializer {
  private _id: number;
  private _lineId: number;
  private _state: MachineState;
  private _queue: QueueItem[];

  constructor(id: number, lineId: number, state: MachineState);
  constructor(
    id: number,
    lineId: number,
    state: MachineState,
    queue: QueueItem[],
  );
  constructor(
    id: number,
    lineId: number,
    state: MachineState,
    queue?: QueueItem[],
  ) {
    super();
    this._id = id;
    this._lineId = lineId;
    this._state = state;
    if (queue) {
      this._queue = queue;
    } else {
      this._queue = [];
    }
  }

  static fromMachineType(machineType: MachineType) {
    const queue = machineType.queue
      ? machineType.queue.map((queueItemType) =>
          QueueItem.fromQueueItemType(queueItemType),
        )
      : [];
    return new Machine(
      machineType.id,
      machineType.lineId,
      machineType.state,
      queue,
    );
  }

  static toMachineType(machine: Machine): MachineType {
    return {
      id: machine.id,
      lineId: machine.lineId,
      state: machine.state,
      queue: machine.queue,
    };
  }

  serialize(): string {
    const machine: MachineType = Machine.toMachineType(this);
    return JSON.stringify(machine);
  }

  static deserialize<T>(objectString: string): T {
    const machine = JSON.parse(objectString) as MachineType;
    return Machine.fromMachineType(machine) as T;
  }

  get id() {
    return this._id;
  }

  get lineId() {
    return this._lineId;
  }

  get state() {
    return this._state;
  }

  get queue() {
    return this._queue;
  }

  set updateState(newState: MachineState) {
    this._state = newState;
  }

  pushQueue(queueItem: QueueItem) {
    this._queue.push(queueItem);
  }

  popQueue() {
    return this._queue.shift();
  }
}
