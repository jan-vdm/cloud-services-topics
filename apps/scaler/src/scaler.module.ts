import { Module } from '@nestjs/common';
import { MqttModule } from '@topics/mqtt';
import { ScalerController } from './scaler.controller';
import { ScalerService } from './scaler.service';

@Module({
  imports: [MqttModule],
  controllers: [ScalerController],
  providers: [ScalerService],
})
export class ScalerModule {}
