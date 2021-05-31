import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

export type Measurement = {
    temperature: number
    humidity: number
    co2: number
    pm2: number
};

export type MeasurementHistory = {
    dates: Date[],
    temperature: number[]
    humidity: number[]
    co2: number[]
    pm2: number[]
    deviceId: string
}

export type UpdateFrequency = 0.25 | 1 | 6 | 12 | 24 | 168;

@Entity('measurement')
export class MeasurementEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP"})
    timestamp: Date;

    @Column()
    deviceId: string;

    @Column('float')
    temperature: number

    @Column('float')
    humidity: number

    @Column('float')
    co2: number

    @Column('float')
    pm2: number
}