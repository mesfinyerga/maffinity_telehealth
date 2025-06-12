import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { UrgencyLevel, LanguageType } from '../common/enums';

@Entity('ai_triage_sessions')
export class AiTriageSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @Column({ name: 'session_data', type: 'jsonb' })
  sessionData: any;

  @Column({ name: 'symptoms_described', type: 'text', nullable: true })
  symptomsDescribed: string;

  @Column({ name: 'ai_assessment', type: 'text', nullable: true })
  aiAssessment: string;

  @Column({
    name: 'urgency_level',
    type: 'enum',
    enum: UrgencyLevel,
    nullable: true,
  })
  urgencyLevel: UrgencyLevel;

  @Column({ name: 'recommended_action', type: 'text', nullable: true })
  recommendedAction: string;

  @Column({
    name: 'language_used',
    type: 'enum',
    enum: LanguageType,
    default: LanguageType.ENGLISH,
  })
  languageUsed: LanguageType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.aiTriageSessions)
  @JoinColumn({ name: 'patient_id' })
  patient: User;
}

