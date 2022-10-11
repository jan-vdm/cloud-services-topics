import { Body, Controller, Post } from '@nestjs/common';
import { DemandService } from './demand.service';

type CreateDemandDto = {
  quantity: number;
};

@Controller()
export class DemandController {
  constructor(private readonly demandService: DemandService) {}

  @Post('/demand')
  async createDemand(@Body() createDemandDto: CreateDemandDto) {
    console.log(`create demand ${createDemandDto.quantity}`);
    await this.demandService.createDemand(createDemandDto.quantity);
    return;
  }
}
