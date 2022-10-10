import { Injectable } from '@nestjs/common';

@Injectable()
export class ScalerService {
  getHello(): string {
    return 'Hello World!';
  }
}
