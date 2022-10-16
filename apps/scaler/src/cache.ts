import { Injectable } from '@nestjs/common';
import { MachineState } from '@prisma/client';
import { Line, Machine, OrderItem, QueueItem } from '@topics/common';

@Injectable()
export class Cache {
  private _lines: Line[] = [];

  constructor() {
    console.log('cache init');
  }

  get lines(): Line[] {
    return this._lines;
  }

  createLine(id: number, machines = []) {
    this._lines.push(new Line(id, machines));
  }

  getLine(id: number): Line {
    const lineIndex = this._lines.findIndex((line) => line.id === id);
    return this._lines[lineIndex];
  }

  saveLine(id: number, line: Line) {
    const lineIndex = this._lines.findIndex((line) => line.id === id);
    this._lines[lineIndex] = line;
  }

  createMachine(lineId: number, machineId: number) {
    const lineIndex = this._lines.findIndex((line) => line.id === lineId);
    this._lines[lineIndex].machines.push(
      new Machine(machineId, MachineState.IDLE),
    );
  }

  getMachine(lineId: number, machineId: number): Machine {
    const lineIndex = this._lines.findIndex((line) => line.id === lineId);
    const machineIndex = this._lines[lineIndex].machines.findIndex(
      (machine) => machine.id === machineId,
    );
    return this._lines[lineIndex].machines[machineIndex];
  }

  getQueue(lineId: number): QueueItem[] {
    const lineIndex = this._lines.findIndex((line) => line.id === lineId);
    return this._lines[lineIndex].queue;
  }

  getQueueItem(lineId: number, itemId: string): QueueItem {
    const lineIndex = this._lines.findIndex((line) => line.id === lineId);
    const queueItemIndex = this._lines[lineIndex].queue.findIndex(
      (queueItem) =>
        queueItem.line.id === lineId && queueItem.item.id === itemId,
    );
    return this._lines[lineIndex].queue[queueItemIndex];
  }

  pushToQueue(lineId: number, item: OrderItem): QueueItem {
    const lineIndex = this._lines.findIndex((line) => line.id === lineId);
    const line = this._lines[lineIndex];
    const queueItem = new QueueItem(line, item, new Date());
    this._lines[lineIndex].pushQueue(queueItem);
    return queueItem;
  }

  popFromQueue(lineId: number) {
    const lineIndex = this._lines.findIndex((line) => line.id === lineId);
    this._lines[lineIndex].popQueue();
  }
}
