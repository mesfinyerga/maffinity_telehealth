import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AiServicesService } from '../src/ai-services/ai-services.service';
import { UserRole } from '../src/common/enums';

describe('AI Services (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let doctorToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create and login a patient
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'patient.ai@test.com',
        password: 'password123',
        firstName: 'AI',
        lastName: 'Patient',
        role: UserRole.PATIENT,
        phoneNumber: '+251911234569',
      });

    const patientLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'patient.ai@test.com',
        password: 'password123',
      });

    accessToken = patientLogin.body.access_token;

    // Create and login a doctor
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'doctor.ai@test.com',
        password: 'password123',
        firstName: 'AI',
        lastName: 'Doctor',
        role: UserRole.DOCTOR,
        phoneNumber: '+251911234570',
        specialization: 'AI Medicine',
        licenseNumber: 'AI12345',
      });

    const doctorLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'doctor.ai@test.com',
        password: 'password123',
      });

    doctorToken = doctorLogin.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/ai-services/triage (POST)', () => {
    it('should perform AI triage analysis', async () => {
      const triageDto = {
        symptoms: 'I have been experiencing headaches for the past 2 days',
        language: 'en',
        patientAge: 30,
        patientGender: 'male',
      };

      const response = await request(app.getHttpServer())
        .post('/ai-services/triage')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(triageDto)
        .expect(201);

      expect(response.body).toHaveProperty('sessionId');
      expect(response.body).toHaveProperty('analysis');
      expect(response.body.analysis).toHaveProperty('urgencyLevel');
      expect(response.body.analysis).toHaveProperty('recommendations');
      expect(response.body.analysis).toHaveProperty('possibleConditions');
    });

    it('should handle Amharic language input', async () => {
      const triageDto = {
        symptoms: 'ራስ ምታት አለብኝ',
        language: 'am',
        patientAge: 25,
        patientGender: 'female',
      };

      const response = await request(app.getHttpServer())
        .post('/ai-services/triage')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(triageDto)
        .expect(201);

      expect(response.body).toHaveProperty('analysis');
      expect(response.body.analysis.language).toBe('am');
    });

    it('should fail without authentication', async () => {
      const triageDto = {
        symptoms: 'I have a headache',
        language: 'en',
      };

      await request(app.getHttpServer())
        .post('/ai-services/triage')
        .send(triageDto)
        .expect(401);
    });

    it('should validate required fields', async () => {
      await request(app.getHttpServer())
        .post('/ai-services/triage')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('/ai-services/analyze-image (POST)', () => {
    it('should analyze medical image', async () => {
      // Mock image upload
      const response = await request(app.getHttpServer())
        .post('/ai-services/analyze-image')
        .set('Authorization', `Bearer ${doctorToken}`)
        .field('imageType', 'xray')
        .field('bodyPart', 'chest')
        .field('patientId', '1')
        .attach('image', Buffer.from('fake-image-data'), 'test-xray.jpg')
        .expect(201);

      expect(response.body).toHaveProperty('analysisId');
      expect(response.body).toHaveProperty('findings');
      expect(response.body).toHaveProperty('confidence');
      expect(response.body).toHaveProperty('recommendations');
    });

    it('should require doctor role for image analysis', async () => {
      await request(app.getHttpServer())
        .post('/ai-services/analyze-image')
        .set('Authorization', `Bearer ${accessToken}`) // Patient token
        .field('imageType', 'xray')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg')
        .expect(403);
    });
  });

  describe('/ai-services/sessions/:userId (GET)', () => {
    it('should get user triage sessions', async () => {
      const response = await request(app.getHttpServer())
        .get('/ai-services/sessions/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('symptoms');
        expect(response.body[0]).toHaveProperty('analysis');
      }
    });

    it('should not allow access to other users sessions', async () => {
      await request(app.getHttpServer())
        .get('/ai-services/sessions/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });

  describe('/ai-services/statistics (GET)', () => {
    it('should get AI usage statistics for admin', async () => {
      // Create admin user
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'admin.ai@test.com',
          password: 'password123',
          firstName: 'AI',
          lastName: 'Admin',
          role: UserRole.ADMIN,
          phoneNumber: '+251911234571',
        });

      const adminLogin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin.ai@test.com',
          password: 'password123',
        });

      const response = await request(app.getHttpServer())
        .get('/ai-services/statistics')
        .set('Authorization', `Bearer ${adminLogin.body.access_token}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalTriageSessions');
      expect(response.body).toHaveProperty('totalImageAnalyses');
      expect(response.body).toHaveProperty('averageUrgencyLevel');
      expect(response.body).toHaveProperty('languageDistribution');
    });

    it('should deny access to non-admin users', async () => {
      await request(app.getHttpServer())
        .get('/ai-services/statistics')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });
});

