import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MeasurementEntity} from './entities/measurement.entity';
import {ClientsModule, Transport} from '@nestjs/microservices';


const entities = [MeasurementEntity];


@Module({
  imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'kek.psy667.com',
        port: 49387,
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
          name: 'MATH_SERVICE',
          transport: Transport.MQTT,
          options: {
            url: 'mqtt://ovz1.arseniyoguzov.n03kn.vps.myjino.ru:49352',
          }
        },
      ]),
      TypeOrmModule.forFeature(entities)
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule.forRoot()],
    //   useFactory: (config: ConfigService) => config.get('database') as ReturnType<typeof appConfig>["database"],
    //   inject: [ConfigService],
    // }),
    // ConfigModule.forRoot({
    //   validationSchema: Joi.object({
    //     DATABASE_HOST: Joi.required(),
    //     DATABASE_PORT: Joi.number().default(process.env.DATABASE_PORT),
    //   }),
    //   load: [appConfig]
    // }),
    // MeasurementModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
