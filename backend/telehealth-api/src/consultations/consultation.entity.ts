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
import { Appointment } from '../appointments/appointment.entity';
import { Message } from './message.entity';
import { MedicalImage } from '../files/medical-image.entity';

@Entity('consultations')
export class Consultation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'appointment_id' })
  appointmentId: string;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamp', nullable: true })
  endedAt: Date;

  @Column({ name: 'duration_minutes', nullable: true })
  durationMinutes: number;

  @Column({ name: 'consultation_notes', type: 'text', nullable: true })
  consultationNotes: string;

  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @Column({ name: 'treatment_plan', type: 'text', nullable: true })
  treatmentPlan: string;

  @Column({ type: 'text', nullable: true })
  prescription: string;

  @Column({ name: 'follow_up_instructions', type: 'text', nullable: true })
  followUpInstructions: string;

  @Column({ 
    name: 'patient_satisfaction_rating', 
    nullable: true,
    type: 'int',
    check: 'patient_satisfaction_rating >= 1 AND patient_satisfaction_rating <= 5'
  })
  patientSatisfactionRating: number;

  @Column({ name: 'doctor_notes', type: 'text', nullable: true })
  doctorNotes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Appointment, (appointment) => appointment.consultations)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @OneToMany(() => Message, (message) => message.consultation)
  messages: Message[];

  @OneToMany(() => MedicalImage, (image) => image.consultation)
  medicalImages: MedicalImage[];
}

