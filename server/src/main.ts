import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const mqtt = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.MQTT,
    options: {
      url: 'mqtt://ovz1.arseniyoguzov.n03kn.vps.myjino.ru:49352',
    },
  });

  await app.listen(3000);
  await mqtt.listen(() => {
    console.log('mqtt started')
  });
}
bootstrap();
