import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Measurement, MeasurementEntity, UpdateFrequency} from './measurement.entity';
import {Repository} from 'typeorm';

@Injectable()
export class AppService {
  constructor(
      @InjectRepository(MeasurementEntity)
      private readonly measurementRepository: Repository<MeasurementEntity>,
  ) {}


  async saveMeasurement(deviceId: string, data: Measurement) {
    const measurement = new MeasurementEntity();
    measurement.deviceId = deviceId;
    measurement.temperature = data.temperature;
    measurement.humidity = data.humidity;
    measurement.co2 = data.co2;
    measurement.pm2 = data['pm2.5'];

    return this.measurementRepository.save(measurement);
  }

  async getMeasurementsHistory(deviceId: string, frequency: UpdateFrequency = 6) {
    const n = frequency * 6;
    const data = await this.measurementRepository.createQueryBuilder("measurement")
        .where(`MOD("id", ${n}) = 0`)
        .take(150)
        .orderBy('id', 'DESC')
        .execute();

    // const result: MeasurementHistory = {
    //   dates: [],
    //   temperature: [],
    //   humidity: [],
    //   co2: [],
    //   pm2: [],
    //   deviceId: deviceId,
    // };
    //
    // data.reverse().forEach(it => {
    //   result.dates.push(it.measurement_timestamp);
    //   result.temperature.push(it.measurement_temperature);
    //   result.humidity.push(it.measurement_humidity);
    //   result.co2.push(it.measurement_co2);
    //   result.pm2.push(it.measurement_pm2);
    // });

    return data.map(it => ({
      co2: it.measurement_co2,
      deviceId: it.measurement_deviceId,
      humidity: it.measurement_humidity,
      id: it.measurement_id,
      pm2: it.measurement_pm2,
      temperature: it.measurement_temperature,
      timestamp: it.measurement_timestamp,
    }));
  }

  async getCurrentValue(deviceId: string) {
    const result = await this.measurementRepository.find({
      where: {deviceId: deviceId},
      take: 1,
      order: {timestamp: 'DESC'},
    });
    const current = result[0];

    return [
      {id: 'temperature', title: 'Температура', value: current.temperature, status: 'green', unit: 'C'},
      {id: 'humidity', title: 'Влажность', value: current.humidity, status: 'green', unit: '%'},
      {id: 'co2', title: 'CO2', value: current.co2, status: 'red', unit: 'ppm'},
      {id: 'pm2', title: 'PM2.5', value: current.pm2, status: 'yellow', unit: 'ug/m3'},
    ];
  }
}
