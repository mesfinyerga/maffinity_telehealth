import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums';
import { CreateMessageDto, EndConsultationDto, RateConsultationDto } from './dto/consultations.dto';

@ApiTags('consultations')
@Controller('consultations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post(':appointmentId/start')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Start a consultation (Doctors only)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Consultation started successfully' })
  async startConsultation(@Param('appointmentId') appointmentId: string) {
    return this.consultationsService.createConsultation(appointmentId);
  }

  @Patch(':consultationId/end')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'End a consultation with notes (Doctors only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Consultation ended successfully' })
  async endConsultation(
    @Request() req,
    @Param('consultationId') consultationId: string,
    @Body() endConsultationDto: EndConsultationDto,
  ) {
    return this.consultationsService.endConsultation(
      consultationId,
      req.user.userId,
      endConsultationDto,
    );
  }

  @Get(':consultationId')
  @ApiOperation({ summary: 'Get consultation details' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Consultation details retrieved successfully' })
  async getConsultation(@Request() req, @Param('consultationId') consultationId: string) {
    return this.consultationsService.getConsultation(consultationId, req.user.userId);
  }

  @Get(':consultationId/messages')
  @ApiOperation({ summary: 'Get consultation messages' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Messages retrieved successfully' })
  async getConsultationMessages(
    @Request() req,
    @Param('consultationId') consultationId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return this.consultationsService.getConsultationMessages(
      consultationId,
      req.user.userId,
      page,
      limit,
    );
  }

  @Post(':consultationId/messages')
  @ApiOperation({ summary: 'Send a message in consultation' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Message sent successfully' })
  async sendMessage(
    @Request() req,
    @Param('consultationId') consultationId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.consultationsService.createMessage({
      ...createMessageDto,
      consultationId,
      senderId: req.user.userId,
    });
  }

  @Patch(':consultationId/messages/read')
  @ApiOperation({ summary: 'Mark messages as read' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Messages marked as read' })
  async markMessagesRead(@Request() req, @Param('consultationId') consultationId: string) {
    await this.consultationsService.markMessagesAsRead(consultationId, req.user.userId);
    return { message: 'Messages marked as read' };
  }

  @Get()
  @ApiOperation({ summary: 'Get user consultations' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Consultations retrieved successfully' })
  async getUserConsultations(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.consultationsService.getUserConsultations(req.user.userId, page, limit);
  }

  @Post(':consultationId/rate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PATIENT)
  @ApiOperation({ summary: 'Rate a consultation (Patients only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Consultation rated successfully' })
  async rateConsultation(
    @Request() req,
    @Param('consultationId') consultationId: string,
    @Body() rateConsultationDto: RateConsultationDto,
  ) {
    return this.consultationsService.rateConsultation(
      consultationId,
      req.user.userId,
      rateConsultationDto.rating,
    );
  }

  @Get('statistics/overview')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get consultation statistics (Doctors/Admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Statistics retrieved successfully' })
  async getConsultationStatistics(@Request() req) {
    const doctorId = req.user.role === UserRole.DOCTOR ? req.user.userId : undefined;
    return this.consultationsService.getConsultationStatistics(doctorId);
  }
}

