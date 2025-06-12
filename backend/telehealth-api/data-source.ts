import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { PatientProfile } from './src/users/patient-profile.entity';
import { DoctorProfile } from './src/users/doctor-profile.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, PatientProfile, DoctorProfile],
  migrations: ['migrations/*.ts'],
});
