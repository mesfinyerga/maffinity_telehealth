import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Consultation } from '../consultations/consultation.entity';
import { MedicalImageType } from '../common/enums';

@Entity('medical_images')
export class MedicalImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @Column({ name: 'consultation_id', nullable: true })
  consultationId: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'file_url' })
  fileUrl: string;

  @Column({ name: 'file_size', nullable: true })
  fileSize: number;

  @Column({ name: 'file_type', nullable: true })
  fileType: string;

  @Column({
    name: 'image_type',
    type: 'enum',
    enum: MedicalImageType,
    nullable: true,
  })
  imageType: MedicalImageType;

  @Column({ name: 'ai_analysis_result', type: 'jsonb', nullable: true })
  aiAnalysisResult: any;

  @Column({ name: 'ai_confidence_score', type: 'decimal', precision: 5, scale: 4, nullable: true })
  aiConfidenceScore: number;

  @Column({ name: 'doctor_reviewed', default: false })
  doctorReviewed: boolean;

  @Column({ name: 'doctor_notes', type: 'text', nullable: true })
  doctorNotes: string;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.medicalImages)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => Consultation, (consultation) => consultation.medicalImages)
  @JoinColumn({ name: 'consultation_id' })
  consultation: Consultation;
}

