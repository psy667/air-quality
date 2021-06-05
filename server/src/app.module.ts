import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MeasurementEntity} from './measurement.entity';
import {ClientsModule, Transport} from '@nestjs/microservices';


const entities = [MeasurementEntity];


@Module({
  imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'pass123',
        database: 'postgres',
        entities: entities,
        synchronize: true,
        autoLoadEntities: true,
        keepConnectionAlive: true,
      }),
      ClientsModule.register([
        {
          name: 'MQTT_SERVICE',
          transport: Transport.MQTT,
          options: {
            url: 'mqtt://localhost:1883',
          }
        },
      ]),
      TypeOrmModule.forFeature(entities)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
