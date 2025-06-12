import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserRole, GenderType, LanguageType } from '../common/enums';
import { PatientProfile } from './patient-profile.entity';
import { DoctorProfile } from './doctor-profile.entity';
import { Appointment } from '../appointments/appointment.entity';
import { Message } from '../consultations/message.entity';
import { AiTriageSession } from '../ai-services/ai-triage-session.entity';
import { MedicalImage } from '../files/medical-image.entity';
import { Notification } from '../notifications/notification.entity';
import { AuditLog } from '../common/audit-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: GenderType,
    nullable: true,
  })
  gender: GenderType;

  @Column({
    name: 'preferred_language',
    type: 'enum',
    enum: LanguageType,
    default: LanguageType.ENGLISH,
  })
  preferredLanguage: LanguageType;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'phone_verified', default: false })
  phoneVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  // Relationships
  @OneToOne(() => PatientProfile, (profile) => profile.user)
  patientProfile: PatientProfile;

  @OneToOne(() => DoctorProfile, (profile) => profile.user)
  doctorProfile: DoctorProfile;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  patientAppointments: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  doctorAppointments: Appointment[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => AiTriageSession, (session) => session.patient)
  aiTriageSessions: AiTriageSession[];

  @OneToMany(() => MedicalImage, (image) => image.patient)
  medicalImages: MedicalImage[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs: AuditLog[];
}

