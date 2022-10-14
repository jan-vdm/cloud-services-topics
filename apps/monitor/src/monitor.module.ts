import { Module } from '@nestjs/common';
import { MqttModule } from '@topics/mqtt';
import { PrismaModule } from '@topics/prisma';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';

@Module({
  imports: [MqttModule, PrismaModule],
  controllers: [MonitorController],
  providers: [MonitorService],
})
export class MonitorModule {}
