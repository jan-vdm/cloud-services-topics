import { Module } from '@nestjs/common';
import { MqttModule } from '@topics/mqtt';
import { DemandController } from './demand.controller';
import { DemandService } from './demand.service';

@Module({
  imports: [MqttModule],
  controllers: [DemandController],
  providers: [DemandService],
})
export class DemandModule {}
