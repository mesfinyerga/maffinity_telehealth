import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Import all modules
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AiServicesModule } from './ai-services/ai-services.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { FilesModule } from './files/files.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AppointmentsModule } from './appointments/appointments.module';

// Import all entities
import { User } from './users/user.entity';
import { PatientProfile } from './users/patient-profile.entity';
import { DoctorProfile } from './users/doctor-profile.entity';
import { AuditLog } from './common/audit-log.entity';
import { AiTriageSession } from './ai-services/ai-triage-session.entity';
import { MedicalImage } from './files/medical-image.entity';
import { Appointment } from './appointments/appointment.entity';
import { Consultation } from './consultations/consultation.entity';
import { Message } from './consultations/message.entity';
import { Notification } from './notifications/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'telehealth',
      entities: [
        User,
        PatientProfile,
        DoctorProfile,
        AuditLog,
        AiTriageSession,
        MedicalImage,
        Appointment,
        Consultation,
        Message,
        Notification,
      ],
      synchronize: process.env.NODE_ENV !== 'production', // Only for development
      logging: process.env.NODE_ENV === 'development',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    
    // Feature modules
    UsersModule,
    AuthModule,
    AiServicesModule,
    ConsultationsModule,
    FilesModule,
    NotificationsModule,
    AppointmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

