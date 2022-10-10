import { Injectable } from '@nestjs/common';

@Injectable()
export class DemandService {
  getHello(): string {
    return 'Hello World!';
  }
}
