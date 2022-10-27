export const topicExtractor = (
  topic: string,
): {
  lineId?: number;
  machineId?: number;
  orderId?: string;
} => {
  const splitTopic = topic.split('/');
  if (
    topic.includes('line') &&
    topic.includes('machine') &&
    topic.includes('order')
  ) {
    return {
      lineId: Number(splitTopic[1]),
      machineId: Number(splitTopic[3]),
      orderId: splitTopic[5],
    };
  }
  if (topic.includes('line') && topic.includes('machine')) {
    return {
      lineId: Number(splitTopic[1]),
      machineId: Number(splitTopic[3]),
    };
  }
  if (topic.includes('line')) {
    return {
      lineId: Number(splitTopic[1]),
    };
  }
};
