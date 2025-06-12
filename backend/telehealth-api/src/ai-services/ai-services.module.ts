import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiServicesService } from './ai-services.service';
import { AiServicesController } from './ai-services.controller';
import { AiTriageService } from './ai-triage.service';
import { AiDiagnosticsService } from './ai-diagnostics.service';
import { AiTriageSession } from './ai-triage-session.entity';
import { MedicalImage } from '../files/medical-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AiTriageSession, MedicalImage])],
  controllers: [AiServicesController],
  providers: [AiServicesService, AiTriageService, AiDiagnosticsService],
  exports: [AiServicesService, AiTriageService, AiDiagnosticsService],
})
export class AiServicesModule {}

