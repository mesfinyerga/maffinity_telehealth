import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { AppointmentStatus, ConsultationType } from '../common/enums';
import { Consultation } from '../consultations/consultation.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @Column({ name: 'appointment_date', type: 'timestamp' })
  appointmentDate: Date;

  @Column({ name: 'duration_minutes', default: 30 })
  durationMinutes: number;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({
    name: 'consultation_type',
    type: 'enum',
    enum: ConsultationType,
    default: ConsultationType.CHAT,
  })
  consultationType: ConsultationType;

  @Column({ name: 'chief_complaint', type: 'text', nullable: true })
  chiefComplaint: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  prescription: string;

  @Column({ name: 'follow_up_required', default: false })
  followUpRequired: boolean;

  @Column({ name: 'follow_up_date', type: 'timestamp', nullable: true })
  followUpDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.patientAppointments)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => User, (user) => user.doctorAppointments)
  @JoinColumn({ name: 'doctor_id' })
  doctor: User;

  @OneToMany(() => Consultation, (consultation) => consultation.appointment)
  consultations: Consultation[];
}

