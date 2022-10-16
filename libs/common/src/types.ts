import { MachineState, OrderStatus } from '@prisma/client';

export type OrderType = {
  id: string;
  items: OrderItemType[];
};

export type OrderItemType = {
  id: string;
  status: OrderStatus;
};

export type OrderPendingEvent = {
  order: OrderType;
};

export type MachineType = {
  id: number;
  state: MachineState;
};

export type LineType = {
  id: number;
  machines: MachineType[];
  queue: QueueItemType[];
};

export type QueueItemType = {
  line: LineType;
  item: OrderItemType;
  queuedAt: Date;
};
