import { Injectable } from '@nestjs/common';
import { Line } from '@topics/common';
import { Cache } from './cache';

@Injectable()
export class LinesHelper {
  constructor(private readonly cache: Cache) {}

  getLineWithLeastNumberOfItems(): Line | undefined {
    const lineCounts = this.getLinesQueueItemCount();
    const lineCount = lineCounts.reduce((prev, curr) => {
      const line = this.cache.getLine(curr.lineId);
      if (line.machines.find((machine) => machine.state === 'BROKEN')) {
        return prev;
      }
      if (prev === undefined) {
        return curr;
      }
      if (prev.queueItemCount > curr.queueItemCount) {
        return curr;
      }
      return prev;
    }, undefined);

    if (lineCount) {
      return this.cache.getLine(lineCount.lineId);
    }
    return undefined;
  }

  private getLinesQueueItemCount(): {
    lineId: number;
    queueItemCount: number;
  }[] {
    return this.cache.lines.map((line) => {
      const queueItemCount = line.machines.reduce<number>((prev, curr) => {
        return prev + curr.queue.length;
      }, 0);
      return {
        lineId: line.id,
        queueItemCount,
      };
    });
  }
}
