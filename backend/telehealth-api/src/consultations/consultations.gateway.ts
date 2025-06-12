import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, UseGuards, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConsultationsService } from './consultations.service';
import { MessageType } from '../common/enums';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  namespace: '/consultations',
})
export class ConsultationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ConsultationsGateway.name);
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private consultationsService: ConsultationsService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
      
      if (!token) {
        this.logger.warn('Client attempted to connect without token');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      client.userId = payload.sub;
      client.userRole = payload.role;
      
      this.connectedUsers.set(payload.sub, client.id);
      
      this.logger.log(`User ${payload.sub} connected with socket ${client.id}`);
      
      // Join user to their personal room
      client.join(`user:${payload.sub}`);
      
    } catch (error) {
      this.logger.error('Authentication failed for WebSocket connection:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.logger.log(`User ${client.userId} disconnected`);
    }
  }

  @SubscribeMessage('join_consultation')
  async handleJoinConsultation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { consultationId: string },
  ) {
    try {
      // Verify user has access to this consultation
      const hasAccess = await this.consultationsService.verifyConsultationAccess(
        data.consultationId,
        client.userId,
      );

      if (!hasAccess) {
        client.emit('error', { message: 'Access denied to consultation' });
        return;
      }

      // Join consultation room
      client.join(`consultation:${data.consultationId}`);
      
      // Notify other participants
      client.to(`consultation:${data.consultationId}`).emit('user_joined', {
        userId: client.userId,
        timestamp: new Date(),
      });

      this.logger.log(`User ${client.userId} joined consultation ${data.consultationId}`);
      
    } catch (error) {
      this.logger.error('Error joining consultation:', error);
      client.emit('error', { message: 'Failed to join consultation' });
    }
  }

  @SubscribeMessage('leave_consultation')
  async handleLeaveConsultation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { consultationId: string },
  ) {
    client.leave(`consultation:${data.consultationId}`);
    
    // Notify other participants
    client.to(`consultation:${data.consultationId}`).emit('user_left', {
      userId: client.userId,
      timestamp: new Date(),
    });

    this.logger.log(`User ${client.userId} left consultation ${data.consultationId}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: {
      consultationId: string;
      messageText: string;
      messageType?: MessageType;
      fileUrl?: string;
    },
  ) {
    try {
      // Verify user has access to this consultation
      const hasAccess = await this.consultationsService.verifyConsultationAccess(
        data.consultationId,
        client.userId,
      );

      if (!hasAccess) {
        client.emit('error', { message: 'Access denied to consultation' });
        return;
      }

      // Save message to database
      const message = await this.consultationsService.createMessage({
        consultationId: data.consultationId,
        senderId: client.userId,
        messageText: data.messageText,
        messageType: data.messageType || MessageType.TEXT,
        fileUrl: data.fileUrl,
      });

      // Broadcast message to all participants in the consultation
      this.server.to(`consultation:${data.consultationId}`).emit('new_message', {
        id: message.id,
        consultationId: message.consultationId,
        senderId: message.senderId,
        messageText: message.messageText,
        messageType: message.messageType,
        fileUrl: message.fileUrl,
        sentAt: message.sentAt,
        sender: {
          id: client.userId,
          firstName: message.sender?.firstName,
          lastName: message.sender?.lastName,
        },
      });

      this.logger.log(`Message sent in consultation ${data.consultationId} by user ${client.userId}`);
      
    } catch (error) {
      this.logger.error('Error sending message:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('typing_start')
  async handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { consultationId: string },
  ) {
    client.to(`consultation:${data.consultationId}`).emit('user_typing', {
      userId: client.userId,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing_stop')
  async handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { consultationId: string },
  ) {
    client.to(`consultation:${data.consultationId}`).emit('user_typing', {
      userId: client.userId,
      isTyping: false,
    });
  }

  @SubscribeMessage('mark_messages_read')
  async handleMarkMessagesRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { consultationId: string },
  ) {
    try {
      await this.consultationsService.markMessagesAsRead(data.consultationId, client.userId);
      
      // Notify other participants that messages were read
      client.to(`consultation:${data.consultationId}`).emit('messages_read', {
        userId: client.userId,
        consultationId: data.consultationId,
        timestamp: new Date(),
      });
      
    } catch (error) {
      this.logger.error('Error marking messages as read:', error);
    }
  }

  // Method to send notifications to specific users
  async sendNotificationToUser(userId: string, notification: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }

  // Method to send updates to consultation participants
  async sendConsultationUpdate(consultationId: string, update: any) {
    this.server.to(`consultation:${consultationId}`).emit('consultation_update', update);
  }
}

