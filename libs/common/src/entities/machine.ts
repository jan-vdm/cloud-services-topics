import { MachineState } from '@prisma/client';
import { Serializer } from '../serializer';
import { MachineType } from '../types';

export class Machine extends Serializer {
  private _id: number;
  private _state: MachineState;

  constructor(id: number, state: MachineState) {
    super();
    this._id = id;
    this._state = state;
  }

  static fromMachineType(machineType: MachineType) {
    return new Machine(machineType.id, machineType.state);
  }

  static toMachineType(machine: Machine): MachineType {
    return {
      id: machine.id,
      state: machine.state,
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

  get state() {
    return this._state;
  }

  set updateState(newState: MachineState) {
    this._state = newState;
  }
}
