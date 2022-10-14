import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MqttModule } from '@topics/mqtt';
import { ScalerController } from './scaler.controller';
import { ScalerService } from './scaler.service';

@Module({
  imports: [MqttModule, EventEmitterModule.forRoot()],
  controllers: [ScalerController],
  providers: [ScalerService],
})
export class ScalerModule {}
