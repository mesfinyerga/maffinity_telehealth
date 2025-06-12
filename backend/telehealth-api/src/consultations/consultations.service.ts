import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation } from './consultation.entity';
import { Message } from './message.entity';
import { Appointment } from '../appointments/appointment.entity';
import { User } from '../users/user.entity';
import { AppointmentStatus, MessageType, UserRole } from '../common/enums';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createConsultation(appointmentId: string): Promise<Consultation> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['patient', 'doctor'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== AppointmentStatus.SCHEDULED) {
      throw new ForbiddenException('Appointment is not in scheduled status');
    }

    // Update appointment status
    await this.appointmentRepository.update(appointmentId, {
      status: AppointmentStatus.IN_PROGRESS,
    });

    // Create consultation
    const consultation = this.consultationRepository.create({
      appointmentId,
      startedAt: new Date(),
    });

    return this.consultationRepository.save(consultation);
  }

  async endConsultation(
    consultationId: string,
    doctorId: string,
    consultationData: {
      consultationNotes?: string;
      diagnosis?: string;
      treatmentPlan?: string;
      prescription?: string;
      followUpInstructions?: string;
    },
  ): Promise<Consultation> {
    const consultation = await this.consultationRepository.findOne({
      where: { id: consultationId },
      relations: ['appointment'],
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // Verify doctor has access
    if (consultation.appointment.doctorId !== doctorId) {
      throw new ForbiddenException('Access denied');
    }

    const endTime = new Date();
    const durationMinutes = Math.round(
      (endTime.getTime() - consultation.startedAt.getTime()) / (1000 * 60),
    );

    // Update consultation
    Object.assign(consultation, {
      ...consultationData,
      endedAt: endTime,
      durationMinutes,
    });

    // Update appointment status
    await this.appointmentRepository.update(consultation.appointmentId, {
      status: AppointmentStatus.COMPLETED,
    });

    return this.consultationRepository.save(consultation);
  }

  async createMessage(messageData: {
    consultationId: string;
    senderId: string;
    messageText: string;
    messageType?: MessageType;
    fileUrl?: string;
  }): Promise<Message> {
    const message = this.messageRepository.create(messageData);
    const savedMessage = await this.messageRepository.save(message);

    // Return message with sender information
    return this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender'],
    });
  }

  async getConsultationMessages(
    consultationId: string,
    userId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ messages: Message[]; total: number }> {
    // Verify user has access to consultation
    const hasAccess = await this.verifyConsultationAccess(consultationId, userId);
    if (!hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    const [messages, total] = await this.messageRepository.findAndCount({
      where: { consultationId },
      relations: ['sender'],
      order: { sentAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { messages: messages.reverse(), total };
  }

  async markMessagesAsRead(consultationId: string, userId: string): Promise<void> {
    await this.messageRepository.update(
      {
        consultationId,
        senderId: userId,
        isRead: false,
      },
      { isRead: true },
    );
  }

  async verifyConsultationAccess(consultationId: string, userId: string): Promise<boolean> {
    const consultation = await this.consultationRepository.findOne({
      where: { id: consultationId },
      relations: ['appointment', 'appointment.patient', 'appointment.doctor'],
    });

    if (!consultation) {
      return false;
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return false;
    }

    // Admin has access to all consultations
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Patient can access their own consultations
    if (consultation.appointment.patientId === userId) {
      return true;
    }

    // Doctor can access consultations they are assigned to
    if (consultation.appointment.doctorId === userId) {
      return true;
    }

    return false;
  }

  async getConsultation(consultationId: string, userId: string): Promise<Consultation> {
    const hasAccess = await this.verifyConsultationAccess(consultationId, userId);
    if (!hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    const consultation = await this.consultationRepository.findOne({
      where: { id: consultationId },
      relations: ['appointment', 'appointment.patient', 'appointment.doctor'],
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    return consultation;
  }

  async getUserConsultations(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ consultations: Consultation[]; total: number }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let whereCondition: any = {};

    if (user.role === UserRole.PATIENT) {
      whereCondition = { appointment: { patientId: userId } };
    } else if (user.role === UserRole.DOCTOR) {
      whereCondition = { appointment: { doctorId: userId } };
    }
    // Admin can see all consultations (no where condition)

    const [consultations, total] = await this.consultationRepository.findAndCount({
      where: whereCondition,
      relations: ['appointment', 'appointment.patient', 'appointment.doctor'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { consultations, total };
  }

  async rateConsultation(
    consultationId: string,
    patientId: string,
    rating: number,
  ): Promise<Consultation> {
    const consultation = await this.consultationRepository.findOne({
      where: { id: consultationId },
      relations: ['appointment'],
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.appointment.patientId !== patientId) {
      throw new ForbiddenException('Only the patient can rate the consultation');
    }

    if (rating < 1 || rating > 5) {
      throw new ForbiddenException('Rating must be between 1 and 5');
    }

    consultation.patientSatisfactionRating = rating;
    return this.consultationRepository.save(consultation);
  }

  async getConsultationStatistics(doctorId?: string): Promise<any> {
    let whereCondition: any = {};
    if (doctorId) {
      whereCondition = { appointment: { doctorId } };
    }

    const totalConsultations = await this.consultationRepository.count({
      where: whereCondition,
    });

    const completedConsultations = await this.consultationRepository.count({
      where: {
        ...whereCondition,
        endedAt: { $ne: null },
      },
    });

    const averageRating = await this.consultationRepository
      .createQueryBuilder('consultation')
      .select('AVG(consultation.patientSatisfactionRating)', 'avg')
      .where(doctorId ? 'appointment.doctorId = :doctorId' : '1=1', { doctorId })
      .leftJoin('consultation.appointment', 'appointment')
      .getRawOne();

    const averageDuration = await this.consultationRepository
      .createQueryBuilder('consultation')
      .select('AVG(consultation.durationMinutes)', 'avg')
      .where(doctorId ? 'appointment.doctorId = :doctorId' : '1=1', { doctorId })
      .leftJoin('consultation.appointment', 'appointment')
      .getRawOne();

    return {
      totalConsultations,
      completedConsultations,
      averageRating: parseFloat(averageRating.avg) || 0,
      averageDuration: parseFloat(averageDuration.avg) || 0,
    };
  }
}

