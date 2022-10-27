import { MachineState, OrderStatus } from '@prisma/client';

export type OrderType = {
  id: string;
  items: OrderItemType[];
};

export type OrderItemType = {
  id: string;
  status: OrderStatus;
};

export type MachineType = {
  id: number;
  lineId: number;
  state: MachineState;
  queue: QueueItemType[];
};

export type LineType = {
  id: number;
  machines: MachineType[];
};

export type QueueItemType = {
  line: LineType;
  machine: MachineType;
  item: OrderItemType;
  queuedAt: Date;
};

// Events
export type OrderPendingEvent = {
  order: OrderType;
};

export type LineUpdateEvent = {
  id: number;
  machines: MachineType[];
};

export type MachineUpdateEvent = {
  id: number;
  state: MachineState;
  orderId: string;
};

export type MachineRemovedOrderEvent = {
  lineId: number;
  machineId: number;
  orderId: string;
};

export type MachineAssignOrderEvent = {
  lineId: number;
  machineId: number;
  orderId: string;
};

export type MachineQueuedOrderEvent = {
  lineId: number;
  machineId: number;
  orderId: string;
};

export type MachineCompletedOrderEvent = {
  lineId: number;
  machineId: number;
  orderId: string;
};
