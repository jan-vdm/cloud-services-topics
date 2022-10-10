import { Controller, Get } from '@nestjs/common';
import { ScalerService } from './scaler.service';

@Controller()
export class ScalerController {
  constructor(private readonly scalerService: ScalerService) {}

  @Get()
  getHello(): string {
    return this.scalerService.getHello();
  }
}
