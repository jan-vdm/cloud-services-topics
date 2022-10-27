import { Serializer } from '../serializer';
import { LineType } from '../types';
import { Machine } from './machine';

export class Line extends Serializer {
  private _id: number;
  private _machines: Machine[];

  constructor(id: number, machines: Machine[]) {
    super();
    this._id = id;
    this._machines = machines;
  }

  static fromLineType(lineType: LineType): Line {
    const machines = lineType.machines.map((machineType) =>
      Machine.fromMachineType(machineType),
    );

    return new Line(lineType.id, machines);
  }

  static toLineType(line: Line): LineType {
    return {
      id: line.id,
      machines: line.machines,
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

  updateMachines(machines: Machine[]) {
    this._machines = machines;
  }
}
