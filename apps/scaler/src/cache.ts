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

  createLine(id: number, machines: Machine[] = []) {
    const newLine = new Line(id, machines);
    this._lines.push(newLine);
    return newLine;
  }

  getLine(id: number): Line | undefined {
    const lineIndex = this._lines.findIndex((line) => line.id === id);
    if (lineIndex == -1) {
      return undefined;
    }
    return this._lines[lineIndex];
  }

  saveLine(id: number, line: Line) {
    const lineIndex = this._lines.findIndex((line) => line.id === id);
    this._lines[lineIndex] = line;
  }

  createMachine(lineId: number, machineId: number) {
    const lineIndex = this._lines.findIndex((line) => line.id === lineId);
    const newMachine = new Machine(machineId, lineId, MachineState.IDLE);
    this._lines[lineIndex].machines.push(newMachine);
    return newMachine;
  }

  getMachine(lineId: number, machineId: number): Machine {
    const lineIndex = this._lines.findIndex((line) => line.id === lineId);
    const machineIndex = this._lines[lineIndex].machines.findIndex(
      (machine) => machine.id === machineId,
    );
    return this._lines[lineIndex].machines[machineIndex];
  }

  saveMachine(lineId: number, machineId: number, machine: Machine) {
    const lineIndex = this._lines.findIndex((line) => line.id === lineId);
    const machineIndex = this._lines[lineIndex].machines.findIndex(
      (m) => m.id === machineId,
    );
    console.log(`save machine`, machine);
    this._lines[lineIndex].machines[machineIndex] = machine;
  }

  getQueue(lineId: number, machineId: number): QueueItem[] {
    const lineIndex = this._lines.findIndex((line) => line.id === lineId);
    const machineIndex = this._lines[lineIndex].machines.findIndex(
      (machine) => machine.id === machineId,
    );
    if (lineIndex == -1 || machineIndex == -1) {
      return [];
    }
    return this._lines[lineIndex].machines[machineIndex].queue;
  }

  getQueueItem(
    lineId: number,
    machineId: number,
    itemId: string,
  ): QueueItem | undefined {
    const lineIndex = this._lines.findIndex((line) => line.id === lineId);
    const machineIndex = this._lines[lineIndex].machines.findIndex(
      (machine) => machine.id === machineId,
    );
    const queueItemIndex = this._lines[lineIndex].machines[
      machineIndex
    ].queue.findIndex(
      (queueItem) =>
        queueItem.line.id === lineId && queueItem.item.id === itemId,
    );
    if (lineIndex == -1 || queueItemIndex == -1 || machineIndex == -1) {
      return undefined;
    }
    return this._lines[lineIndex].machines[machineIndex].queue[queueItemIndex];
  }

  pushToQueue(lineId: number, machineId: number, item: OrderItem): QueueItem {
    console.log(this._lines, lineId, machineId, item.id);
    const lineIndex = this._lines.findIndex((line) => line.id === lineId);
    const line = this._lines[lineIndex];
    const machineIndex = line.machines.findIndex(
      (machine) => machine.id === machineId,
    );
    const machine = line.machines[machineIndex];
    const queueItem = new QueueItem(line, machine, item, new Date());
    this._lines[lineIndex].machines[machineIndex].pushQueue(queueItem);
    return queueItem;
  }

  popFromQueue(lineId: number, machineId: number) {
    const lineIndex = this._lines.findIndex((line) => line.id === lineId);
    const machineIndex = this._lines[lineIndex].machines.findIndex(
      (machine) => machine.id === machineId,
    );
    return this._lines[lineIndex].machines[machineIndex].popQueue();
  }
}
