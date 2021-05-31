export type Measurement = {
    temperature: number,
    humidity: number,
    co2: number,
    pm2: number,
    timestamp: Date,
    deviceId: string
};

export type MeasurementHistory = Measurement[]

// export type MeasurementHistory = {
//     dates: Date[],
//     temperature: number[]
//     humidity: number[]
//     co2: number[]
//     pm2: number[]
//     deviceId: string
// };

export type MeasurementKeys = Exclude<keyof Measurement, 'timestamp' | 'deviceId'>

export type UpdateFrequency = 0.25 | 1 | 6 | 12 | 24 | 168;