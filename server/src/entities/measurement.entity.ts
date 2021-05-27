import {Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

export type Measurement = {
    temperature: number
    humidity: number
    co2: number
    pm2: number
};

@Entity('measurement')
export class MeasurementEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
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