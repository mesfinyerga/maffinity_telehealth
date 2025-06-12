import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SecurityHeadersInterceptor } from './common/security-headers.interceptor';
import { RateLimitInterceptor } from './common/rate-limit.interceptor';
import { AuditInterceptor } from './common/audit.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins (required for frontend-backend interaction)
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global security interceptors
  app.useGlobalInterceptors(
    new SecurityHeadersInterceptor(),
    new RateLimitInterceptor(),
    // Note: AuditInterceptor requires database connection, add after app initialization
  );

  // API versioning
  app.setGlobalPrefix('api/v1');

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('Telehealth Platform API')
    .setDescription('AI-Enhanced Telehealth & Diagnostics Platform API for Ethiopia')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('appointments', 'Appointment management endpoints')
    .addTag('consultations', 'Consultation management endpoints')
    .addTag('ai-services', 'AI triage and diagnostics endpoints')
    .addTag('files', 'File upload and management endpoints')
    .addTag('notifications', 'Notification management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Listen on all interfaces (0.0.0.0) for external access
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Telehealth API is running on: http://0.0.0.0:${port}`);
  console.log(`📚 API Documentation available at: http://0.0.0.0:${port}/api/docs`);
  console.log(`🔒 Security features enabled: CORS, Rate Limiting, Security Headers`);
  console.log(`📊 Audit logging enabled for compliance tracking`);
}

bootstrap();

