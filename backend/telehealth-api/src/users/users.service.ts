import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { PatientProfile } from './patient-profile.entity';
import { DoctorProfile } from './doctor-profile.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  CreatePatientProfileDto,
  CreateDoctorProfileDto,
} from './dto/user.dto';
import { UserRole } from '../common/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PatientProfile)
    private patientProfileRepository: Repository<PatientProfile>,
    @InjectRepository(DoctorProfile)
    private doctorProfileRepository: Repository<DoctorProfile>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
        ...(createUserDto.phone ? [{ phone: createUserDto.phone }] : []),
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or phone already exists',
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    // Create user
    const { password, ...rest } = createUserDto;
    const user = this.usersRepository.create({
      ...rest,
      passwordHash,
      dateOfBirth: createUserDto.dateOfBirth
        ? new Date(createUserDto.dateOfBirth)
        : undefined,
    });

    const savedUser = await this.usersRepository.save(user);

    // Create profile based on role
    if (createUserDto.role === UserRole.PATIENT) {
      await this.createPatientProfile(savedUser.id, {});
    }

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['patientProfile', 'doctorProfile'],
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        preferredLanguage: true,
        isActive: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['patientProfile', 'doctorProfile'],
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        preferredLanguage: true,
        isActive: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['patientProfile', 'doctorProfile'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, {
      ...updateUserDto,
      dateOfBirth: updateUserDto.dateOfBirth
        ? new Date(updateUserDto.dateOfBirth)
        : user.dateOfBirth,
    });

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async createPatientProfile(
    userId: string,
    createPatientProfileDto: CreatePatientProfileDto,
  ): Promise<PatientProfile> {
    const profile = this.patientProfileRepository.create({
      userId,
      ...createPatientProfileDto,
    });

    return this.patientProfileRepository.save(profile);
  }

  async updatePatientProfile(
    userId: string,
    updatePatientProfileDto: CreatePatientProfileDto,
  ): Promise<PatientProfile> {
    const profile = await this.patientProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      return this.createPatientProfile(userId, updatePatientProfileDto);
    }

    Object.assign(profile, updatePatientProfileDto);
    return this.patientProfileRepository.save(profile);
  }

  async createDoctorProfile(
    userId: string,
    createDoctorProfileDto: CreateDoctorProfileDto,
  ): Promise<DoctorProfile> {
    // Check if license number already exists
    const existingDoctor = await this.doctorProfileRepository.findOne({
      where: { licenseNumber: createDoctorProfileDto.licenseNumber },
    });

    if (existingDoctor) {
      throw new ConflictException(
        'Doctor with this license number already exists',
      );
    }

    const profile = this.doctorProfileRepository.create({
      userId,
      ...createDoctorProfileDto,
    });

    return this.doctorProfileRepository.save(profile);
  }

  async updateDoctorProfile(
    userId: string,
    updateDoctorProfileDto: CreateDoctorProfileDto,
  ): Promise<DoctorProfile> {
    const profile = await this.doctorProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      return this.createDoctorProfile(userId, updateDoctorProfileDto);
    }

    Object.assign(profile, updateDoctorProfileDto);
    return this.doctorProfileRepository.save(profile);
  }

  async findDoctors(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: UserRole.DOCTOR, isActive: true },
      relations: ['doctorProfile'],
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        preferredLanguage: true,
        createdAt: true,
      },
    });
  }

  async verifyDoctor(doctorId: string): Promise<DoctorProfile> {
    const doctor = await this.usersRepository.findOne({
      where: { id: doctorId, role: UserRole.DOCTOR },
      relations: ['doctorProfile'],
    });

    if (!doctor || !doctor.doctorProfile) {
      throw new NotFoundException('Doctor not found');
    }

    doctor.doctorProfile.isVerified = true;
    return this.doctorProfileRepository.save(doctor.doctorProfile);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { lastLogin: new Date() });
  }
}
