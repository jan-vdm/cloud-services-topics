import { NestFactory } from '@nestjs/core';
import { ScalerModule } from './scaler.module';

async function bootstrap() {
  const app = await NestFactory.create(ScalerModule);
  await app.listen(3000);
}
bootstrap();
