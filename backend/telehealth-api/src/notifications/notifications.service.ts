import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../users/user.entity';
import { NotificationType } from '../common/enums';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createNotification(
    userId: string,
    title: string,
    message: string,
    notificationType: NotificationType,
    actionUrl?: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      title,
      message,
      notificationType,
      actionUrl,
    });

    const savedNotification = await this.notificationRepository.save(notification);
    
    // TODO: Send push notification, email, or SMS based on user preferences
    await this.sendNotification(savedNotification);
    
    return savedNotification;
  }

  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false,
  ): Promise<{ notifications: Notification[]; total: number; unreadCount: number }> {
    const whereCondition: any = { userId };
    if (unreadOnly) {
      whereCondition.isRead = false;
    }

    const [notifications, total] = await this.notificationRepository.findAndCount({
      where: whereCondition,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const unreadCount = await this.notificationRepository.count({
      where: { userId, isRead: false },
    });

    return { notifications, total, unreadCount };
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.notificationRepository.update(
      { id: notificationId, userId },
      { isRead: true },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    await this.notificationRepository.delete({ id: notificationId, userId });
  }

  // Notification templates for common scenarios
  async notifyAppointmentScheduled(patientId: string, doctorId: string, appointmentDate: Date): Promise<void> {
    // Notify patient
    await this.createNotification(
      patientId,
      'Appointment Scheduled',
      `Your appointment has been scheduled for ${appointmentDate.toLocaleDateString()}`,
      NotificationType.APPOINTMENT,
      '/appointments',
    );

    // Notify doctor
    await this.createNotification(
      doctorId,
      'New Appointment',
      `You have a new appointment scheduled for ${appointmentDate.toLocaleDateString()}`,
      NotificationType.APPOINTMENT,
      '/doctor/appointments',
    );
  }

  async notifyAppointmentReminder(userId: string, appointmentDate: Date): Promise<void> {
    await this.createNotification(
      userId,
      'Appointment Reminder',
      `You have an appointment in 1 hour at ${appointmentDate.toLocaleTimeString()}`,
      NotificationType.REMINDER,
      '/appointments',
    );
  }

  async notifyConsultationStarted(patientId: string, doctorName: string): Promise<void> {
    await this.createNotification(
      patientId,
      'Consultation Started',
      `Dr. ${doctorName} has started your consultation`,
      NotificationType.CONSULTATION,
      '/consultations',
    );
  }

  async notifyNewMessage(userId: string, senderName: string, consultationId: string): Promise<void> {
    await this.createNotification(
      userId,
      'New Message',
      `You have a new message from ${senderName}`,
      NotificationType.MESSAGE,
      `/consultations/${consultationId}`,
    );
  }

  async notifyAiTriageComplete(userId: string, urgencyLevel: string): Promise<void> {
    const urgencyMessages = {
      'LOW': 'Your symptoms appear to be minor. Consider self-care measures.',
      'MEDIUM': 'Your symptoms require attention. Consider scheduling an appointment.',
      'HIGH': 'Your symptoms need prompt medical attention. Please schedule an appointment soon.',
      'EMERGENCY': 'Your symptoms require immediate medical attention. Please seek emergency care.',
    };

    await this.createNotification(
      userId,
      'AI Triage Complete',
      urgencyMessages[urgencyLevel] || 'Your symptom assessment is complete.',
      NotificationType.AI_ANALYSIS,
      '/ai-triage/results',
    );
  }

  async notifyImageAnalysisComplete(userId: string, imageId: string): Promise<void> {
    await this.createNotification(
      userId,
      'Image Analysis Complete',
      'Your medical image analysis is ready for review',
      NotificationType.AI_ANALYSIS,
      `/images/${imageId}/analysis`,
    );
  }

  async notifyPrescriptionReady(patientId: string, doctorName: string): Promise<void> {
    await this.createNotification(
      patientId,
      'Prescription Ready',
      `Dr. ${doctorName} has issued a new prescription for you`,
      NotificationType.PRESCRIPTION,
      '/prescriptions',
    );
  }

  async notifyFollowUpRequired(patientId: string, followUpDate: Date): Promise<void> {
    await this.createNotification(
      patientId,
      'Follow-up Required',
      `You have a follow-up appointment scheduled for ${followUpDate.toLocaleDateString()}`,
      NotificationType.FOLLOW_UP,
      '/appointments',
    );
  }

  private async sendNotification(notification: Notification): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: notification.userId },
      });

      if (!user) {
        this.logger.warn(`User not found for notification: ${notification.id}`);
        return;
      }

      // TODO: Implement actual notification sending
      // This could include:
      // - Push notifications (Firebase, OneSignal)
      // - Email notifications (SendGrid, AWS SES)
      // - SMS notifications (Twilio, AWS SNS)
      // - In-app notifications (WebSocket)

      this.logger.log(`Notification sent to user ${user.id}: ${notification.title}`);
      
    } catch (error) {
      this.logger.error('Error sending notification:', error);
    }
  }

  async getNotificationStatistics(userId?: string): Promise<any> {
    let whereCondition: any = {};
    if (userId) {
      whereCondition.userId = userId;
    }

    const totalNotifications = await this.notificationRepository.count({
      where: whereCondition,
    });

    const unreadNotifications = await this.notificationRepository.count({
      where: { ...whereCondition, isRead: false },
    });

    const notificationsByType = await this.notificationRepository
      .createQueryBuilder('notification')
      .select('notification.notificationType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where(userId ? 'notification.userId = :userId' : '1=1', { userId })
      .groupBy('notification.notificationType')
      .getRawMany();

    return {
      totalNotifications,
      unreadNotifications,
      notificationsByType,
    };
  }
}

