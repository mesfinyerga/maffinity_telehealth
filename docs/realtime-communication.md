# Real-time Communication & File Upload Services

## Overview
This document describes the implementation of real-time communication capabilities and secure file upload services for the telehealth platform, enabling seamless doctor-patient interactions and secure medical file management.

## Real-time Communication System

### WebSocket Implementation
The platform uses Socket.IO for real-time bidirectional communication with the following features:

- **Authenticated Connections**: JWT token validation for all WebSocket connections
- **Room-based Communication**: Consultation-specific rooms for private conversations
- **Message Persistence**: All messages stored in database with full history
- **Typing Indicators**: Real-time typing status for enhanced user experience
- **Connection Management**: Automatic reconnection and presence tracking

### WebSocket Events

#### Connection Events
```typescript
// Client connects with JWT token
socket.connect({
  auth: { token: 'jwt-token' }
});

// Server validates and assigns user to personal room
socket.join(`user:${userId}`);
```

#### Consultation Events
```typescript
// Join consultation room
socket.emit('join_consultation', { consultationId: 'uuid' });

// Send message
socket.emit('send_message', {
  consultationId: 'uuid',
  messageText: 'Hello doctor',
  messageType: 'text'
});

// Typing indicators
socket.emit('typing_start', { consultationId: 'uuid' });
socket.emit('typing_stop', { consultationId: 'uuid' });

// Mark messages as read
socket.emit('mark_messages_read', { consultationId: 'uuid' });
```

#### Server Events
```typescript
// New message received
socket.on('new_message', (message) => {
  // Display message in UI
});

// User typing status
socket.on('user_typing', ({ userId, isTyping }) => {
  // Show/hide typing indicator
});

// Consultation updates
socket.on('consultation_update', (update) => {
  // Handle consultation status changes
});
```

### Message Types
- **TEXT**: Plain text messages
- **IMAGE**: Image attachments with thumbnails
- **FILE**: Document attachments
- **VOICE**: Voice message recordings
- **SYSTEM**: Automated system messages

### Security Features
- **Authentication**: JWT token validation for all connections
- **Authorization**: Room access verification based on consultation participants
- **Rate Limiting**: Message frequency limits to prevent spam
- **Content Filtering**: Automatic content moderation for inappropriate content

## File Upload System

### AWS S3 Integration
Secure file upload using AWS S3 with presigned URLs:

```typescript
// Generate upload URL
POST /api/v1/files/upload-url
{
  "fileName": "medical-report.pdf",
  "fileType": "application/pdf",
  "folder": "medical-images"
}

// Response with presigned URL
{
  "uploadUrl": "https://s3.amazonaws.com/presigned-url",
  "fileKey": "medical-files/user-id/uuid.pdf",
  "fileUrl": "https://s3.amazonaws.com/final-url"
}
```

### File Processing Pipeline
1. **Upload Validation**: File type and size validation
2. **Virus Scanning**: Automated malware detection
3. **Image Processing**: Optimization and thumbnail generation
4. **Metadata Extraction**: File information and EXIF data handling
5. **Storage Organization**: Structured folder hierarchy by user and type

### Supported File Types

#### Medical Images
- **X-rays**: JPEG, PNG, DICOM
- **Lab Results**: PDF, JPEG, PNG
- **Prescriptions**: PDF, JPEG, PNG
- **Skin Lesions**: JPEG, PNG, WebP

#### Documents
- **Medical Reports**: PDF, DOC, DOCX
- **Insurance Documents**: PDF, JPEG, PNG
- **Identification**: JPEG, PNG (encrypted)

### Security Measures
- **Presigned URLs**: Time-limited upload/download URLs
- **Virus Scanning**: Real-time malware detection
- **Encryption**: Files encrypted at rest and in transit
- **Access Control**: Role-based file access permissions
- **Audit Logging**: Complete file access history

## Consultation Management

### Consultation Lifecycle
1. **Appointment Scheduling**: Patient books appointment with doctor
2. **Consultation Start**: Doctor initiates consultation session
3. **Real-time Communication**: Chat, file sharing, and collaboration
4. **Medical Documentation**: Notes, diagnosis, and treatment plans
5. **Consultation End**: Summary and follow-up instructions
6. **Rating and Feedback**: Patient satisfaction assessment

### Consultation Features

#### Chat Functionality
- **Real-time Messaging**: Instant message delivery
- **File Attachments**: Medical images and documents
- **Message History**: Complete conversation archive
- **Read Receipts**: Message delivery and read status
- **Search**: Full-text search across message history

#### Medical Documentation
- **Consultation Notes**: Detailed session documentation
- **Diagnosis Recording**: Structured diagnosis entry
- **Treatment Plans**: Comprehensive care instructions
- **Prescription Management**: Digital prescription generation
- **Follow-up Scheduling**: Automated appointment booking

### Database Schema

#### Consultations Table
```sql
CREATE TABLE consultations (
  id UUID PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id),
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  duration_minutes INTEGER,
  consultation_notes TEXT,
  diagnosis TEXT,
  treatment_plan TEXT,
  prescription TEXT,
  follow_up_instructions TEXT,
  patient_satisfaction_rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  doctor_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  consultation_id UUID REFERENCES consultations(id),
  sender_id UUID REFERENCES users(id),
  message_text TEXT NOT NULL,
  message_type message_type_enum DEFAULT 'text',
  file_url VARCHAR(500),
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT NOW()
);
```

## Notification System

### Notification Types
- **APPOINTMENT**: Appointment scheduling and reminders
- **CONSULTATION**: Consultation start/end notifications
- **MESSAGE**: New message alerts
- **AI_ANALYSIS**: AI triage and image analysis results
- **PRESCRIPTION**: New prescription notifications
- **REMINDER**: Follow-up and medication reminders
- **SYSTEM**: System maintenance and updates

### Delivery Channels
- **In-App**: Real-time WebSocket notifications
- **Email**: SMTP-based email notifications
- **SMS**: Twilio-based text message alerts
- **Push**: Mobile app push notifications

### Notification Templates

#### Appointment Reminder
```typescript
{
  title: "Appointment Reminder",
  message: "You have an appointment in 1 hour at 2:00 PM",
  type: "REMINDER",
  actionUrl: "/appointments"
}
```

#### AI Analysis Complete
```typescript
{
  title: "AI Analysis Complete",
  message: "Your symptom assessment is ready for review",
  type: "AI_ANALYSIS",
  actionUrl: "/ai-triage/results"
}
```

### User Preferences
- **Notification Channels**: Email, SMS, push preferences
- **Frequency Settings**: Immediate, daily digest, weekly summary
- **Content Filtering**: Notification type preferences
- **Quiet Hours**: Do not disturb time periods

## Performance Optimization

### WebSocket Scaling
- **Redis Adapter**: Multi-server WebSocket synchronization
- **Connection Pooling**: Efficient connection management
- **Message Queuing**: Reliable message delivery
- **Load Balancing**: Distributed WebSocket servers

### File Upload Optimization
- **CDN Integration**: CloudFront for global file delivery
- **Compression**: Automatic file compression
- **Caching**: Intelligent file caching strategies
- **Bandwidth Management**: Upload/download speed optimization

### Database Performance
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Indexed queries for fast retrieval
- **Caching**: Redis caching for frequently accessed data
- **Pagination**: Efficient large dataset handling

## Monitoring and Analytics

### Real-time Metrics
- **Active Connections**: Current WebSocket connections
- **Message Volume**: Messages per second/minute/hour
- **File Upload Stats**: Upload success rates and speeds
- **Error Rates**: Connection failures and message delivery issues

### Usage Analytics
- **Consultation Duration**: Average session lengths
- **Message Patterns**: Communication frequency analysis
- **File Usage**: Upload/download patterns
- **User Engagement**: Active user metrics

### Health Monitoring
- **WebSocket Health**: Connection stability monitoring
- **S3 Performance**: Upload/download success rates
- **Database Performance**: Query execution times
- **Error Tracking**: Comprehensive error logging

## Security and Compliance

### Data Protection
- **End-to-End Encryption**: Message and file encryption
- **Access Logging**: Complete audit trail
- **Data Retention**: Configurable retention policies
- **Privacy Controls**: User data management tools

### Compliance Features
- **HIPAA Compliance**: Healthcare data protection
- **GDPR Compliance**: European data protection
- **Audit Trails**: Complete activity logging
- **Data Anonymization**: Privacy-preserving analytics

This real-time communication and file upload system provides a robust foundation for secure, efficient healthcare interactions while maintaining the highest standards of security and compliance.

