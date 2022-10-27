import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MqttModule } from '@topics/mqtt';
import { ScalerController } from './scaler.controller';
import { ScalerService } from './scaler.service';
import { Cache } from './cache';
import { LineService } from './line/line.service';
import { LinesHelper } from './lines-helper';

@Module({
  imports: [MqttModule, EventEmitterModule.forRoot()],
  controllers: [ScalerController],
  providers: [ScalerService, Cache, LineService, LinesHelper],
})
export class ScalerModule {}
