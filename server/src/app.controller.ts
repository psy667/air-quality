import {Controller, Get, Param} from '@nestjs/common';
import {AppService} from './app.service';
import {Ctx, MessagePattern, MqttContext, Payload} from '@nestjs/microservices';
import {Measurement} from './measurement.entity';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  mainPage() {
    return 'All ok!';
  }

  @Get('api/getHistory/:deviceId/:frequency')
  getHistory(@Param('deviceId') deviceId, @Param('frequency') frequency) {
    return this.appService.getMeasurementsHistory(deviceId, frequency);
  }

  @Get('api/getCurrentValue/:deviceId')
  getCurrentValue(@Param('deviceId') deviceId) {
    return this.appService.getCurrentValue(deviceId,);
  }

  @MessagePattern('+')
  getMeasurements(@Payload() data: Measurement, @Ctx() context: MqttContext) {
    const deviceId = context.getTopic();

    return this.appService.saveMeasurement(deviceId, data);
  }

}

