import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConsultationsService } from './consultations.service';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsGateway } from './consultations.gateway';
import { Consultation } from './consultation.entity';
import { Message } from './message.entity';
import { Appointment } from '../appointments/appointment.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consultation, Message, Appointment, User]),
    JwtModule,
  ],
  controllers: [ConsultationsController],
  providers: [ConsultationsService, ConsultationsGateway],
  exports: [ConsultationsService, ConsultationsGateway],
})
export class ConsultationsModule {}

