import { NestFactory } from '@nestjs/core';
import { DemandModule } from './demand.module';

async function bootstrap() {
  const app = await NestFactory.create(DemandModule);
  await app.listen(3000);
}
bootstrap();
