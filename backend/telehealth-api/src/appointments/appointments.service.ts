import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createAppointment(appointmentData: any): Promise<Appointment> {
    try {
      const appointment = this.appointmentRepository.create(appointmentData);
      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      this.logger.error('Error creating appointment:', error);
      throw error;
    }
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { doctor: { id: doctorId } },
      relations: ['patient', 'doctor'],
      order: { scheduledAt: 'ASC' },
    });
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { patient: { id: patientId } },
      relations: ['patient', 'doctor'],
      order: { scheduledAt: 'ASC' },
    });
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    await this.appointmentRepository.update(id, { status });
    return await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
  }
}

