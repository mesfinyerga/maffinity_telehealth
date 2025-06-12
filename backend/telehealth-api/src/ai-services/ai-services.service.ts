import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiTriageSession } from './ai-triage-session.entity';
import { MedicalImage } from '../files/medical-image.entity';
import { AiTriageService } from './ai-triage.service';
import { AiDiagnosticsService } from './ai-diagnostics.service';
import { CreateTriageSessionDto, TriageResponseDto, ImageAnalysisResponseDto } from './dto/ai-services.dto';
import { LanguageType, MedicalImageType } from '../common/enums';

@Injectable()
export class AiServicesService {
  constructor(
    @InjectRepository(AiTriageSession)
    private triageSessionRepository: Repository<AiTriageSession>,
    @InjectRepository(MedicalImage)
    private medicalImageRepository: Repository<MedicalImage>,
    private aiTriageService: AiTriageService,
    private aiDiagnosticsService: AiDiagnosticsService,
  ) {}

  async createTriageSession(
    patientId: string,
    createTriageSessionDto: CreateTriageSessionDto,
  ): Promise<TriageResponseDto> {
    const { symptomsDescription, language = LanguageType.ENGLISH } = createTriageSessionDto;

    // Get AI analysis
    const aiAnalysis = await this.aiTriageService.analyzeSymptoms(symptomsDescription, language);

    // Save triage session
    const triageSession = this.triageSessionRepository.create({
      patientId,
      sessionData: {
        originalSymptoms: symptomsDescription,
        language,
        timestamp: new Date().toISOString(),
      },
      symptomsDescribed: symptomsDescription,
      aiAssessment: aiAnalysis.assessment,
      urgencyLevel: aiAnalysis.urgencyLevel,
      recommendedAction: aiAnalysis.recommendedAction,
      languageUsed: language,
    });

    const savedSession = await this.triageSessionRepository.save(triageSession);

    return {
      assessment: aiAnalysis.assessment,
      urgencyLevel: aiAnalysis.urgencyLevel,
      recommendedAction: aiAnalysis.recommendedAction,
      sessionId: savedSession.id,
    };
  }

  async analyzeImage(
    patientId: string,
    imagePath: string,
    fileName: string,
    fileSize: number,
    imageType: MedicalImageType,
    description?: string,
    consultationId?: string,
  ): Promise<ImageAnalysisResponseDto> {
    // Perform AI analysis
    const aiAnalysis = await this.aiDiagnosticsService.analyzeImage(imagePath, imageType, description);

    // Save medical image record
    const medicalImage = this.medicalImageRepository.create({
      patientId,
      consultationId,
      fileName,
      fileUrl: imagePath,
      fileSize,
      fileType: this.getFileType(fileName),
      imageType,
      aiAnalysisResult: aiAnalysis.analysisResult,
      aiConfidenceScore: aiAnalysis.confidenceScore,
    });

    const savedImage = await this.medicalImageRepository.save(medicalImage);

    return {
      imageId: savedImage.id,
      analysisResult: aiAnalysis.analysisResult,
      confidenceScore: aiAnalysis.confidenceScore,
      status: 'Analysis completed successfully',
    };
  }

  async getTriageHistory(patientId: string): Promise<AiTriageSession[]> {
    return this.triageSessionRepository.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
      take: 10, // Limit to last 10 sessions
    });
  }

  async getImageAnalysisHistory(patientId: string): Promise<MedicalImage[]> {
    return this.medicalImageRepository.find({
      where: { patientId },
      order: { uploadedAt: 'DESC' },
      take: 20, // Limit to last 20 images
    });
  }

  async getImageAnalysis(imageId: string): Promise<MedicalImage> {
    const image = await this.medicalImageRepository.findOne({
      where: { id: imageId },
      relations: ['patient'],
    });

    if (!image) {
      throw new Error('Image not found');
    }

    return image;
  }

  async updateDoctorReview(
    imageId: string,
    doctorNotes: string,
    doctorId: string,
  ): Promise<MedicalImage> {
    const image = await this.medicalImageRepository.findOne({
      where: { id: imageId },
    });

    if (!image) {
      throw new Error('Image not found');
    }

    image.doctorReviewed = true;
    image.doctorNotes = doctorNotes;

    return this.medicalImageRepository.save(image);
  }

  async generateImageReport(imageId: string): Promise<string> {
    const image = await this.getImageAnalysis(imageId);
    
    const patientInfo = {
      patientId: image.patientId,
      imageType: image.imageType,
      uploadDate: image.uploadedAt,
    };

    return this.aiDiagnosticsService.generateImageReport(image.aiAnalysisResult, patientInfo);
  }

  private getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const imageTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'webp': 'image/webp',
      'pdf': 'application/pdf',
    };
    return imageTypes[extension] || 'application/octet-stream';
  }

  async getTriageStatistics(): Promise<any> {
    const totalSessions = await this.triageSessionRepository.count();
    
    const urgencyStats = await this.triageSessionRepository
      .createQueryBuilder('session')
      .select('session.urgencyLevel', 'urgencyLevel')
      .addSelect('COUNT(*)', 'count')
      .groupBy('session.urgencyLevel')
      .getRawMany();

    const languageStats = await this.triageSessionRepository
      .createQueryBuilder('session')
      .select('session.languageUsed', 'language')
      .addSelect('COUNT(*)', 'count')
      .groupBy('session.languageUsed')
      .getRawMany();

    return {
      totalSessions,
      urgencyDistribution: urgencyStats,
      languageDistribution: languageStats,
    };
  }

  async getImageAnalysisStatistics(): Promise<any> {
    const totalImages = await this.medicalImageRepository.count();
    
    const typeStats = await this.medicalImageRepository
      .createQueryBuilder('image')
      .select('image.imageType', 'imageType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('image.imageType')
      .getRawMany();

    const reviewStats = await this.medicalImageRepository
      .createQueryBuilder('image')
      .select('image.doctorReviewed', 'reviewed')
      .addSelect('COUNT(*)', 'count')
      .groupBy('image.doctorReviewed')
      .getRawMany();

    return {
      totalImages,
      typeDistribution: typeStats,
      reviewStatus: reviewStats,
    };
  }
}

