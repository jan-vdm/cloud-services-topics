export const EVENT_TOPICS = {
  ORDER_PLACED: 'order/placed',
  ORDER_PENDING: 'order/pending',
  ORDER_UPDATE: 'order/update',
  MACHINE_UPDATE: 'line/+/machine/+/update',
  MACHINE_ASSIGN_ORDER: 'line/+/machine/+/order/+/assign',
  MACHINE_QUEUED_ORDER: 'line/+/machine/+/order/+/queued',
  MACHINE_REMOVED_ORDER: 'line/+/machine/+/order/+/removed',
  MACHINE_COMPLETED_ORDER: 'line/+/machine/+/order/+/complete',
  LINE_UPDATE: 'line/+',
};

export default { EVENT_TOPICS };
