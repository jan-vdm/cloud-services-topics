import { Module } from '@nestjs/common';
import { ScalerController } from './scaler.controller';
import { ScalerService } from './scaler.service';

@Module({
  imports: [],
  controllers: [ScalerController],
  providers: [ScalerService],
})
export class ScalerModule {}
