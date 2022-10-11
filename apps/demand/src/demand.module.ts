import { Module } from '@nestjs/common';
import { DemandController } from './demand.controller';
import { DemandService } from './demand.service';
import { MqttModule } from '@topics/mqtt';

@Module({
  imports: [MqttModule],
  controllers: [DemandController],
  providers: [DemandService],
})
export class DemandModule {}
