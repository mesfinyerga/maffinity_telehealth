export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

export enum GenderType {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum LanguageType {
  ENGLISH = 'english',
  AMHARIC = 'amharic',
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum ConsultationType {
  CHAT = 'chat',
  VIDEO = 'video',
  PHONE = 'phone',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  DOCUMENT = 'document',
  SYSTEM = 'system',
}

export enum UrgencyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  EMERGENCY = 'emergency',
}

export enum MedicalImageType {
  XRAY = 'xray',
  SKIN_LESION = 'skin_lesion',
  LAB_RESULT = 'lab_result',
  PRESCRIPTION = 'prescription',
  OTHER = 'other',
}

export enum NotificationType {
  APPOINTMENT_REMINDER = 'appointment_reminder',
  MESSAGE_RECEIVED = 'message_received',
  PRESCRIPTION_READY = 'prescription_ready',
  SYSTEM_UPDATE = 'system_update',
}

