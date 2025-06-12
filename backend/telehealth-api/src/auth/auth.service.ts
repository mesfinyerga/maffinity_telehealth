import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from './dto/auth.dto';
import { UserRole } from '../common/enums';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user
    const user = await this.usersService.create(registerDto);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Remove password from response
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as User,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; accessToken: string; refreshToken: string; mfaRequired: boolean }> {
    const { email, password } = loginDto;

    // Find user with password
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['patientProfile', 'doctorProfile'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Remove password from response
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as User,
      mfaRequired: false, // TODO: Implement MFA check
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'refresh-secret'),
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // Don't reveal if email exists or not
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token to user (you'll need to add these fields to User entity)
    await this.usersRepository.update(user.id, {
      // resetToken,
      // resetTokenExpiry,
    });

    // TODO: Send email with reset link
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    // Find user by reset token
    const user = await this.usersRepository.findOne({
      where: {
        // resetToken: token,
        // resetTokenExpiry: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    await this.usersRepository.update(user.id, {
      passwordHash,
      // resetToken: null,
      // resetTokenExpiry: null,
    });

    return { message: 'Password has been reset successfully' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.usersRepository.update(userId, { passwordHash });

    return { message: 'Password changed successfully' };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '24h'),
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'refresh-secret'),
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  async verifyEmail(userId: string, token: string): Promise<{ message: string }> {
    // TODO: Implement email verification logic
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.usersRepository.update(userId, { emailVerified: true });
    return { message: 'Email verified successfully' };
  }

  async verifyPhone(userId: string, code: string): Promise<{ message: string }> {
    // TODO: Implement phone verification logic
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.usersRepository.update(userId, { phoneVerified: true });
    return { message: 'Phone verified successfully' };
  }

  async logout(userId: string): Promise<{ message: string }> {
    // TODO: Implement token blacklisting if needed
    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }
}

