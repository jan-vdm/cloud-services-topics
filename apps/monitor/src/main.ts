import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { MonitorModule } from './monitor.module';

async function bootstrap() {
  setTimeout(async () => {
    const app = await NestFactory.create(MonitorModule, {
      cors: { origin: '*' },
    });
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.listen(3001);
  }, 1000);
}
bootstrap();
