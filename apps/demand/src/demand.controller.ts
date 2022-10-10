import { Controller, Get } from '@nestjs/common';
import { DemandService } from './demand.service';

@Controller()
export class DemandController {
  constructor(private readonly appService: DemandService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
