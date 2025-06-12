import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Consultation } from './consultation.entity';
import { MessageType } from '../common/enums';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'consultation_id' })
  consultationId: string;

  @Column({ name: 'sender_id' })
  senderId: string;

  @Column({ name: 'message_text', type: 'text' })
  messageText: string;

  @Column({
    name: 'message_type',
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  messageType: MessageType;

  @Column({ name: 'file_url', nullable: true })
  fileUrl: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @CreateDateColumn({ name: 'sent_at' })
  sentAt: Date;

  // Relationships
  @ManyToOne(() => Consultation, (consultation) => consultation.messages)
  @JoinColumn({ name: 'consultation_id' })
  consultation: Consultation;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'sender_id' })
  sender: User;
}

