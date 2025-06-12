import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UrgencyLevel, LanguageType, MedicalImageType } from '../../common/enums';

export class CreateTriageSessionDto {
  @ApiProperty({ example: 'I have been experiencing headaches and fever for the past 2 days' })
  @IsString()
  symptomsDescription: string;

  @ApiPropertyOptional({ enum: LanguageType, example: LanguageType.ENGLISH })
  @IsOptional()
  @IsEnum(LanguageType)
  language?: LanguageType;
}

export class TriageResponseDto {
  @ApiProperty({ example: 'Based on your symptoms, you may have a viral infection...' })
  assessment: string;

  @ApiProperty({ enum: UrgencyLevel, example: UrgencyLevel.MEDIUM })
  urgencyLevel: UrgencyLevel;

  @ApiProperty({ example: 'Consider scheduling a consultation with a healthcare provider...' })
  recommendedAction: string;

  @ApiProperty({ example: 'session-uuid-123' })
  sessionId: string;
}

export class ImageAnalysisDto {
  @ApiPropertyOptional({ enum: MedicalImageType, example: MedicalImageType.XRAY })
  @IsOptional()
  @IsEnum(MedicalImageType)
  imageType?: MedicalImageType;

  @ApiPropertyOptional({ example: 'Chest X-ray for pneumonia screening' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class ImageAnalysisResponseDto {
  @ApiProperty({ example: 'image-uuid-123' })
  imageId: string;

  @ApiProperty({ 
    example: {
      findings: ['Possible consolidation in right lower lobe'],
      confidence: 0.85,
      recommendations: ['Further evaluation recommended']
    }
  })
  analysisResult: any;

  @ApiProperty({ example: 0.85 })
  confidenceScore: number;

  @ApiProperty({ example: 'Analysis completed successfully' })
  status: string;
}

