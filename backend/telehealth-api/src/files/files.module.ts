import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FileUploadService } from './file-upload.service';

@Module({
  controllers: [FilesController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FilesModule {}

