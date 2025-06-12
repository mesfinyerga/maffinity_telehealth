import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileUploadRequestDto, FileUploadResponseDto } from '../consultations/dto/consultations.dto';

@ApiTags('files')
@Controller('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Generate presigned URL for file upload' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Presigned upload URL generated successfully',
    type: FileUploadResponseDto 
  })
  async generateUploadUrl(
    @Request() req,
    @Body() fileUploadRequestDto: FileUploadRequestDto,
  ): Promise<FileUploadResponseDto> {
    const { fileName, fileType, folder = 'medical-files' } = fileUploadRequestDto;
    
    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!this.fileUploadService.validateFileType(fileType, allowedTypes)) {
      throw new Error('File type not allowed');
    }

    return this.fileUploadService.generatePresignedUploadUrl(
      fileName,
      fileType,
      req.user.userId,
      folder,
    );
  }

  @Get(':fileKey/download-url')
  @ApiOperation({ summary: 'Generate presigned URL for file download' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Presigned download URL generated successfully' })
  async generateDownloadUrl(
    @Param('fileKey') fileKey: string,
    @Query('expiresIn') expiresIn: number = 3600,
  ) {
    const downloadUrl = await this.fileUploadService.generatePresignedDownloadUrl(
      fileKey,
      expiresIn,
    );
    
    return { downloadUrl };
  }

  @Post(':fileKey/process')
  @ApiOperation({ summary: 'Process uploaded file (virus scan, optimization)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'File processed successfully' })
  async processFile(@Param('fileKey') fileKey: string) {
    // Perform virus scanning
    const isClean = await this.fileUploadService.scanFileForViruses(fileKey);
    if (!isClean) {
      throw new Error('File failed virus scan');
    }

    // Process image if it's an image file
    let processingResult = null;
    if (fileKey.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
      processingResult = await this.fileUploadService.processImage(fileKey);
    }

    return {
      message: 'File processed successfully',
      virusScanPassed: isClean,
      processingResult,
    };
  }
}

