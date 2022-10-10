import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DemandController } from './demand.controller';
import { DemandService } from './demand.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MQTT_Service',
        transport: Transport.MQTT,
        options: {
          url: '',
        },
      },
    ]),
  ],
  controllers: [DemandController],
  providers: [DemandService],
})
export class DemandModule {}
