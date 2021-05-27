import {Controller, Get, Param} from '@nestjs/common';
import { AppService } from './app.service';
import {Ctx, MessagePattern, MqttContext, Payload} from '@nestjs/microservices';
import {BehaviorSubject, Subject} from 'rxjs';
import {type} from 'os';
import {Column} from 'typeorm';
import {Measurement} from './entities/measurement.entity';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get('history/:deviceId')
  getHello(@Param('deviceId') deviceId) {

    return this.appService.getMeasurementsHistory(deviceId);
  }

  @MessagePattern('+')
  getMeasurements(@Payload() data: Measurement, @Ctx() context: MqttContext) {
    const deviceId = context.getTopic();

    return this.appService.saveMeasurement(deviceId, data);
  }

}
