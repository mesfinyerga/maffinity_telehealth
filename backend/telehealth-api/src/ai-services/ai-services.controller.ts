import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Query,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AiServicesService } from './ai-services.service';
import { CreateTriageSessionDto, ImageAnalysisDto, TriageResponseDto, ImageAnalysisResponseDto } from './dto/ai-services.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, MedicalImageType } from '../common/enums';

@ApiTags('ai-services')
@Controller('ai-services')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiServicesController {
  constructor(private readonly aiServicesService: AiServicesService) {}

  @Post('triage')
  @ApiOperation({ summary: 'Create AI triage session for symptom analysis' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Triage session created successfully', type: TriageResponseDto })
  async createTriageSession(
    @Request() req,
    @Body() createTriageSessionDto: CreateTriageSessionDto,
  ): Promise<TriageResponseDto> {
    return this.aiServicesService.createTriageSession(req.user.userId, createTriageSessionDto);
  }

  @Post('image-analysis')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/medical-images',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|bmp|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload and analyze medical image' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Image analyzed successfully', type: ImageAnalysisResponseDto })
  async analyzeImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() imageAnalysisDto: ImageAnalysisDto,
  ): Promise<ImageAnalysisResponseDto> {
    if (!file) {
      throw new Error('No image file uploaded');
    }

    return this.aiServicesService.analyzeImage(
      req.user.userId,
      file.path,
      file.originalname,
      file.size,
      imageAnalysisDto.imageType || MedicalImageType.OTHER,
      imageAnalysisDto.description,
    );
  }

  @Get('triage/history')
  @ApiOperation({ summary: 'Get patient triage history' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Triage history retrieved successfully' })
  getTriageHistory(@Request() req) {
    return this.aiServicesService.getTriageHistory(req.user.userId);
  }

  @Get('images/history')
  @ApiOperation({ summary: 'Get patient image analysis history' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Image analysis history retrieved successfully' })
  getImageHistory(@Request() req) {
    return this.aiServicesService.getImageAnalysisHistory(req.user.userId);
  }

  @Get('images/:imageId')
  @ApiOperation({ summary: 'Get specific image analysis' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Image analysis retrieved successfully' })
  getImageAnalysis(@Param('imageId') imageId: string) {
    return this.aiServicesService.getImageAnalysis(imageId);
  }

  @Get('images/:imageId/report')
  @ApiOperation({ summary: 'Generate detailed image analysis report' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Report generated successfully' })
  generateImageReport(@Param('imageId') imageId: string) {
    return this.aiServicesService.generateImageReport(imageId);
  }

  @Patch('images/:imageId/review')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Add doctor review to image analysis (Doctors only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Doctor review added successfully' })
  addDoctorReview(
    @Request() req,
    @Param('imageId') imageId: string,
    @Body('notes') notes: string,
  ) {
    return this.aiServicesService.updateDoctorReview(imageId, notes, req.user.userId);
  }

  @Get('statistics/triage')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get triage statistics (Admin/Doctor only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Triage statistics retrieved successfully' })
  getTriageStatistics() {
    return this.aiServicesService.getTriageStatistics();
  }

  @Get('statistics/images')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get image analysis statistics (Admin/Doctor only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Image analysis statistics retrieved successfully' })
  getImageStatistics() {
    return this.aiServicesService.getImageAnalysisStatistics();
  }
}

