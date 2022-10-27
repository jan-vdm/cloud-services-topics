import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '@topics/prisma';

@Controller()
export class MonitorController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getAll() {
    const lines = await this.prisma.line.findMany({
      include: {
        machines: true,
      },
    });

    const items = await this.prisma.queueItem.findMany();

    return {
      lines,
      items,
    };
  }
}
