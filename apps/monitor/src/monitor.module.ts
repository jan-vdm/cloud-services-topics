import { Module } from '@nestjs/common';
import { MqttModule } from '@topics/mqtt';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
import { PrismaModule, PrismaService } from '@topics/prisma';

@Module({
  imports: [MqttModule, PrismaModule],
  controllers: [MonitorController],
  providers: [MonitorService, PrismaService],
})
export class MonitorModule {}
