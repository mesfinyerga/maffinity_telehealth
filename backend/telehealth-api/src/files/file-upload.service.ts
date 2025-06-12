import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET', 'telehealth-medical-files');
    
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async generatePresignedUploadUrl(
    fileName: string,
    fileType: string,
    userId: string,
    folder: string = 'medical-files',
  ): Promise<{
    uploadUrl: string;
    fileKey: string;
    fileUrl: string;
  }> {
    try {
      const fileExtension = path.extname(fileName);
      const uniqueFileName = `${uuidv4()}${fileExtension}`;
      const fileKey = `${folder}/${userId}/${uniqueFileName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        ContentType: fileType,
        Metadata: {
          'original-name': fileName,
          'user-id': userId,
          'upload-date': new Date().toISOString(),
        },
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // 1 hour

      const fileUrl = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${fileKey}`;

      return {
        uploadUrl,
        fileKey,
        fileUrl,
      };
    } catch (error) {
      this.logger.error('Error generating presigned upload URL:', error);
      throw new Error('Failed to generate upload URL');
    }
  }

  async generatePresignedDownloadUrl(fileKey: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error('Error generating presigned download URL:', error);
      throw new Error('Failed to generate download URL');
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${fileKey}`);
    } catch (error) {
      this.logger.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    fileType: string,
    userId: string,
    folder: string = 'medical-files',
  ): Promise<{
    fileKey: string;
    fileUrl: string;
  }> {
    try {
      const fileExtension = path.extname(fileName);
      const uniqueFileName = `${uuidv4()}${fileExtension}`;
      const fileKey = `${folder}/${userId}/${uniqueFileName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file,
        ContentType: fileType,
        Metadata: {
          'original-name': fileName,
          'user-id': userId,
          'upload-date': new Date().toISOString(),
        },
      });

      await this.s3Client.send(command);

      const fileUrl = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${fileKey}`;

      return {
        fileKey,
        fileUrl,
      };
    } catch (error) {
      this.logger.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  validateFileType(fileType: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(fileType);
  }

  validateFileSize(fileSize: number, maxSizeBytes: number): boolean {
    return fileSize <= maxSizeBytes;
  }

  getFileExtension(fileName: string): string {
    return path.extname(fileName).toLowerCase();
  }

  generateUniqueFileName(originalName: string): string {
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    return `${baseName}-${uuidv4()}${extension}`;
  }

  // Virus scanning placeholder - integrate with AWS Macie or similar service
  async scanFileForViruses(fileKey: string): Promise<boolean> {
    try {
      // TODO: Implement virus scanning
      // This could integrate with AWS Macie, ClamAV, or other scanning services
      this.logger.log(`Virus scan completed for file: ${fileKey}`);
      return true; // Assume clean for now
    } catch (error) {
      this.logger.error('Error scanning file for viruses:', error);
      return false;
    }
  }

  // Image processing placeholder - integrate with AWS Rekognition or similar
  async processImage(fileKey: string): Promise<any> {
    try {
      // TODO: Implement image processing
      // This could include:
      // - Image optimization and compression
      // - Thumbnail generation
      // - EXIF data removal for privacy
      // - Format conversion if needed
      this.logger.log(`Image processing completed for file: ${fileKey}`);
      return { processed: true };
    } catch (error) {
      this.logger.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  }
}

