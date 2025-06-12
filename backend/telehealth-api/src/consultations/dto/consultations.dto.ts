import { IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageType, MedicalImageType } from '../../common/enums';

export class CreateMessageDto {
  @ApiProperty({ example: 'consultation-uuid' })
  @IsString()
  consultationId: string;

  @ApiProperty({ example: 'Hello, how are you feeling today?' })
  @IsString()
  messageText: string;

  @ApiPropertyOptional({ enum: MessageType, example: MessageType.TEXT })
  @IsOptional()
  @IsEnum(MessageType)
  messageType?: MessageType;

  @ApiPropertyOptional({ example: 'https://s3.amazonaws.com/bucket/file.jpg' })
  @IsOptional()
  @IsString()
  fileUrl?: string;
}

export class EndConsultationDto {
  @ApiPropertyOptional({ example: 'Patient presented with symptoms of...' })
  @IsOptional()
  @IsString()
  consultationNotes?: string;

  @ApiPropertyOptional({ example: 'Viral upper respiratory infection' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ example: 'Rest, fluids, and follow-up in 3 days' })
  @IsOptional()
  @IsString()
  treatmentPlan?: string;

  @ApiPropertyOptional({ example: 'Paracetamol 500mg twice daily for 3 days' })
  @IsOptional()
  @IsString()
  prescription?: string;

  @ApiPropertyOptional({ example: 'Return if symptoms worsen or persist beyond 5 days' })
  @IsOptional()
  @IsString()
  followUpInstructions?: string;
}

export class RateConsultationDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}

export class FileUploadRequestDto {
  @ApiProperty({ example: 'medical-report.pdf' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: 'application/pdf' })
  @IsString()
  fileType: string;

  @ApiPropertyOptional({ enum: MedicalImageType, example: MedicalImageType.XRAY })
  @IsOptional()
  @IsEnum(MedicalImageType)
  imageType?: MedicalImageType;

  @ApiPropertyOptional({ example: 'medical-images' })
  @IsOptional()
  @IsString()
  folder?: string;
}

export class FileUploadResponseDto {
  @ApiProperty({ example: 'https://s3.amazonaws.com/bucket/upload-url' })
  uploadUrl: string;

  @ApiProperty({ example: 'medical-files/user-id/file-uuid.pdf' })
  fileKey: string;

  @ApiProperty({ example: 'https://s3.amazonaws.com/bucket/file-url' })
  fileUrl: string;
}

