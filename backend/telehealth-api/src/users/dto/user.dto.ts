import { IsEmail, IsString, IsOptional, IsEnum, IsDateString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, GenderType, LanguageType } from '../common/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+251911234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.PATIENT })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: GenderType, example: GenderType.MALE })
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @ApiPropertyOptional({ enum: LanguageType, example: LanguageType.ENGLISH })
  @IsOptional()
  @IsEnum(LanguageType)
  preferredLanguage?: LanguageType;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: '+251911234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: GenderType, example: GenderType.MALE })
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @ApiPropertyOptional({ enum: LanguageType, example: LanguageType.ENGLISH })
  @IsOptional()
  @IsEnum(LanguageType)
  preferredLanguage?: LanguageType;
}

export class CreatePatientProfileDto {
  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({ example: '+251911234568' })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({ example: 'Spouse' })
  @IsOptional()
  @IsString()
  emergencyContactRelationship?: string;

  @ApiPropertyOptional({ example: 'No significant medical history' })
  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @ApiPropertyOptional({ example: 'Penicillin allergy' })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiPropertyOptional({ example: 'Aspirin 81mg daily' })
  @IsOptional()
  @IsString()
  currentMedications?: string;

  @ApiPropertyOptional({ example: 'Ethiopian Health Insurance' })
  @IsOptional()
  @IsString()
  insuranceProvider?: string;

  @ApiPropertyOptional({ example: 'EHI123456789' })
  @IsOptional()
  @IsString()
  insuranceNumber?: string;

  @ApiPropertyOptional({ example: '123 Main Street, Addis Ababa' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Addis Ababa' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Addis Ababa' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ example: '1000' })
  @IsOptional()
  @IsString()
  postalCode?: string;
}

export class CreateDoctorProfileDto {
  @ApiProperty({ example: 'MD123456' })
  @IsString()
  licenseNumber: string;

  @ApiProperty({ example: 'Internal Medicine' })
  @IsString()
  specialization: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  yearsOfExperience?: number;

  @ApiPropertyOptional({ example: 'MD from Addis Ababa University' })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional({ example: 'Board Certified Internal Medicine' })
  @IsOptional()
  @IsString()
  certifications?: string;

  @ApiPropertyOptional({ example: 'Experienced physician specializing in internal medicine' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 500.00 })
  @IsOptional()
  consultationFee?: number;
}

