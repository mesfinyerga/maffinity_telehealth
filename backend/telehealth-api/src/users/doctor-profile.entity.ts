import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('doctor_profiles')
export class DoctorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'license_number', unique: true })
  licenseNumber: string;

  @Column()
  specialization: string;

  @Column({ name: 'years_of_experience', nullable: true })
  yearsOfExperience: number;

  @Column({ type: 'text', nullable: true })
  education: string;

  @Column({ type: 'text', nullable: true })
  certifications: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'consultation_fee', type: 'decimal', precision: 10, scale: 2, nullable: true })
  consultationFee: number;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @Column({ name: 'average_rating', type: 'decimal', precision: 3, scale: 2, default: 0.00 })
  averageRating: number;

  @Column({ name: 'total_consultations', default: 0 })
  totalConsultations: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToOne(() => User, (user) => user.doctorProfile)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

