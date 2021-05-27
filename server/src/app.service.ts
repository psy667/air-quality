import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Measurement, MeasurementEntity} from './entities/measurement.entity';
import {Connection, MoreThan, Repository} from 'typeorm';

@Injectable()
export class AppService {
  constructor(
      @InjectRepository(MeasurementEntity)
      private readonly measurementRepository: Repository<MeasurementEntity>,
      // private readonly connection: Connection,
  ) {}


  getHello(): string {
    return 'Hello World!';
  }

  async saveMeasurement(deviceId: string, data: Measurement) {
    const measurement = new MeasurementEntity();
    measurement.deviceId = deviceId;
    measurement.temperature = data.temperature;
    measurement.humidity = data.humidity;
    measurement.co2 = data.co2;
    measurement.pm2 = data['pm2.5'];

    return this.measurementRepository.save(measurement);
  }

  async getMeasurementsHistory(deviceId: string) {
    console.log(deviceId);
    return this.measurementRepository.find({
      where: {deviceId: deviceId},
      take: 20,
      order: {timestamp: 'DESC'},

    })
  }
}
