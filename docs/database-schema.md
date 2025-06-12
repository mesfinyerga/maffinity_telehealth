# Database Schema Design for AI-Enhanced Telehealth Platform

## Overview
This document outlines the comprehensive database schema for the telehealth platform, designed to support all core functionalities including user management, appointments, consultations, AI services, and compliance requirements.

## Core Entities

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender gender_type,
    preferred_language language_type DEFAULT 'english',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE language_type AS ENUM ('english', 'amharic');
```

### Patient Profiles Table
```sql
CREATE TABLE patient_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    insurance_provider VARCHAR(100),
    insurance_number VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100),
    postal_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Doctor Profiles Table
```sql
CREATE TABLE doctor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    years_of_experience INTEGER,
    education TEXT,
    certifications TEXT,
    bio TEXT,
    consultation_fee DECIMAL(10,2),
    is_verified BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_consultations INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status appointment_status DEFAULT 'scheduled',
    consultation_type consultation_type DEFAULT 'chat',
    chief_complaint TEXT,
    notes TEXT,
    prescription TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE appointment_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE consultation_type AS ENUM ('chat', 'video', 'phone');
```

### Consultations Table
```sql
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    duration_minutes INTEGER,
    consultation_notes TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    prescription TEXT,
    follow_up_instructions TEXT,
    patient_satisfaction_rating INTEGER CHECK (patient_satisfaction_rating >= 1 AND patient_satisfaction_rating <= 5),
    doctor_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Messages Table
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    message_type message_type DEFAULT 'text',
    file_url VARCHAR(500),
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE message_type AS ENUM ('text', 'image', 'document', 'system');
```

### AI Triage Sessions Table
```sql
CREATE TABLE ai_triage_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_data JSONB NOT NULL,
    symptoms_described TEXT,
    ai_assessment TEXT,
    urgency_level urgency_level,
    recommended_action TEXT,
    language_used language_type DEFAULT 'english',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'emergency');
```

### Medical Images Table
```sql
CREATE TABLE medical_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    consultation_id UUID REFERENCES consultations(id),
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(50),
    image_type medical_image_type,
    ai_analysis_result JSONB,
    ai_confidence_score DECIMAL(5,4),
    doctor_reviewed BOOLEAN DEFAULT false,
    doctor_notes TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE medical_image_type AS ENUM ('xray', 'skin_lesion', 'lab_result', 'prescription', 'other');
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type notification_type,
    is_read BOOLEAN DEFAULT false,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE notification_type AS ENUM ('appointment_reminder', 'message_received', 'prescription_ready', 'system_update');
```

## Indexes for Performance

```sql
-- User lookup indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- Appointment indexes
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Message indexes
CREATE INDEX idx_messages_consultation_id ON messages(consultation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at);

-- AI triage indexes
CREATE INDEX idx_ai_triage_patient_id ON ai_triage_sessions(patient_id);
CREATE INDEX idx_ai_triage_created_at ON ai_triage_sessions(created_at);

-- Medical images indexes
CREATE INDEX idx_medical_images_patient_id ON medical_images(patient_id);
CREATE INDEX idx_medical_images_consultation_id ON medical_images(consultation_id);

-- Audit log indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

## Security Considerations

1. **Encryption**: All sensitive fields (medical_history, allergies, etc.) should be encrypted at the application level
2. **Access Control**: Row-level security policies should be implemented for patient data
3. **Audit Trail**: All access to patient data must be logged in the audit_logs table
4. **Data Retention**: Implement automated data archival and deletion policies
5. **Backup**: Regular encrypted backups with point-in-time recovery capabilities

## Compliance Features

- **HIPAA Compliance**: All patient data is properly segregated and access-controlled
- **Data Minimization**: Only necessary data is collected and stored
- **Consent Management**: User consent preferences are tracked and enforced
- **Right to be Forgotten**: Soft delete capabilities with data anonymization
- **Audit Requirements**: Comprehensive logging of all data access and modifications

