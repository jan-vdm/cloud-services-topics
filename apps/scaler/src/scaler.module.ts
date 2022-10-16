import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MqttModule } from '@topics/mqtt';
import { ScalerController } from './scaler.controller';
import { ScalerService } from './scaler.service';
import { Cache } from './cache';

@Module({
  imports: [MqttModule, EventEmitterModule.forRoot()],
  controllers: [ScalerController],
  providers: [ScalerService, Cache],
})
export class ScalerModule {}
