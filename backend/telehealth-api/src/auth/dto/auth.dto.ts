import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, GenderType, LanguageType } from '../../common/enums';

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @MinLength(8)
  password: string;
}

export class RegisterDto {
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
  @IsString()
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

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token-here' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'CurrentPassword123!' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class VerifyEmailDto {
  @ApiProperty({ example: 'email-verification-token' })
  @IsString()
  token: string;
}

export class VerifyPhoneDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  code: string;
}

export class EnableMfaDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  code: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'jwt-access-token' })
  accessToken: string;

  @ApiProperty({ example: 'jwt-refresh-token' })
  refreshToken: string;

  @ApiProperty({ 
    example: {
      id: 'user-uuid',
      email: 'john.doe@example.com',
      role: 'patient',
      firstName: 'John',
      lastName: 'Doe'
    }
  })
  user: any;

  @ApiProperty({ example: false })
  mfaRequired: boolean;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'jwt-refresh-token' })
  @IsString()
  refreshToken: string;
}

