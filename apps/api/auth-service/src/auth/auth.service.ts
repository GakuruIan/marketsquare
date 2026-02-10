import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';

import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/prisma/prisma.service';
import { randomInt } from 'crypto';
import { MailService } from '@/mail/mail.service';

import { JwtService } from '@nestjs/jwt';
import { VerifyEmailDTO } from './dto/verify-email.dto';

import { VerificationCode } from '@/generated/prisma/client';
import { LoginDTO } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

type VerificationCodeResult = Pick<
  VerificationCode,
  'id' | 'code' | 'expiresAt'
>;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly db: PrismaService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  private readonly CODE_EXPIRY_MINUTES = 15;

  validateUser(usernameOrEmail: string, password: string) {
    return { usernameOrEmail, password };
  }

  private async generateVerificationCode(
    authId: string,
    type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET',
    userAgent?: string,
    ipAddress?: string,
  ): Promise<VerificationCodeResult> {
    await this.db.verificationCode.updateMany({
      where: {
        authId,
        type,
        used: false,
      },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    const code = randomInt(100000, 999999).toString();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.CODE_EXPIRY_MINUTES);

    const verificationCode = await this.db.verificationCode.create({
      data: {
        authId,
        code,
        type,
        expiresAt,
        userAgent,
        ipAddress,
      },
      select: {
        id: true,
        code: true,
        expiresAt: true,
      },
    });

    return verificationCode;
  }

  private async checkUserExists(email: string, username: string) {
    const existingAuth = await this.db.auth.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (existingAuth) {
      if (existingAuth.email === email) {
        throw new ConflictException('Email already exists');
      }

      if (existingAuth?.username === username) {
        throw new ConflictException('Username already exists');
      }
    }
  }

  private async generateTokens(
    authId: string,
    email: string,
    username: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessPayload = {
      sub: authId,
      email,
      username,
    };

    const refreshPayload = {
      sub: authId,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),

      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  // handle failed login attempts and lockout
  private async handleFailedLogin(authId: string): Promise<void> {
    const auth = await this.db.auth.findUnique({
      where: { id: authId },
      select: { failedLoginAttempts: true },
    });

    const newFailedAttempts = (auth?.failedLoginAttempts || 0) + 1;
    const MAX_FAILED_ATTEMPTS = 5;
    const LOCK_DURATION_MINUTES = 15;

    const updateData: any = {
      failedLoginAttempts: newFailedAttempts,
    };

    // Lock account after max attempts
    if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
      updateData.lockedUntil = new Date(
        Date.now() + LOCK_DURATION_MINUTES * 60 * 1000,
      );
    }

    await this.db.auth.update({
      where: { id: authId },
      data: updateData,
    });
  }

  async login(loginDTO: LoginDTO, userAgent: string, ipAddress: string) {
    const { identifier, password } = loginDTO;

    const auth = await this.db.auth.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!auth) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!auth.verified) {
      throw new UnauthorizedException('Email is not verified');
    }

    if (auth.status !== 'ACTIVE') {
      throw new BadRequestException(
        `Account is ${auth.status.toLowerCase().replace('_', ' ')}`,
      );
    }

    if (auth.lockedUntil && auth.lockedUntil > new Date()) {
      const remainingTime = Math.ceil(
        (auth.lockedUntil.getTime() - Date.now()) / 1000 / 60,
      );
      throw new UnauthorizedException(
        `Account is locked. Try again in ${remainingTime} minutes`,
      );
    }

    const passwordMatch = await bcrypt.compare(password, auth.password);

    if (!passwordMatch) {
      await this.handleFailedLogin(auth.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(
      auth.id,
      auth.email,
      auth.username,
    );

    await this.db.session.create({
      data: {
        authId: auth.id,
        userAgent,
        ipAddress,
        refreshToken: tokens.refreshToken,
        token: tokens.accessToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // reset failed attempts on successful login
    await this.db.auth.update({
      where: { id: auth.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        refreshToken: tokens.refreshToken,
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: auth.id,
        email: auth.email,
        username: auth.username,
        verified: auth.verified,
        status: auth.status,
      },
    };
  }

  // register
  async register(
    registerDTO: RegisterDTO,
    userAgent: string,
    ipAddress: string,
  ) {
    await this.checkUserExists(registerDTO.email, registerDTO.username);

    let emailSent = false;
    let auth: {
      id: string;
      username: string;
      email: string;
      verified: boolean;
    } | null = null;

    const verificationCode = randomInt(100000, 999999).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.CODE_EXPIRY_MINUTES);

    const hashedPassword = await bcrypt.hash(registerDTO.password, 10);

    try {
      auth = await this.db.$transaction(async (tx) => {
        const createdAuth = await tx.auth.create({
          data: {
            username: registerDTO.username,
            email: registerDTO.email,
            password: hashedPassword,
          },
          select: {
            id: true,
            username: true,
            email: true,
            verified: true,
          },
        });

        await tx.verificationCode.create({
          data: {
            authId: createdAuth.id,
            code: verificationCode,
            type: 'EMAIL_VERIFICATION',
            expiresAt,
            userAgent,
            ipAddress,
          },
        });

        return createdAuth;
      });

      await this.mailService.sendVerificationEmail(
        auth.email,
        auth.username,
        verificationCode,
      );
      emailSent = true;

      const pendingToken = this.jwtService.sign(
        {
          authId: auth.id,
          type: 'pending_signup',
        },
        {
          expiresIn: `${this.CODE_EXPIRY_MINUTES}m`,
        },
      );

      return {
        ...auth,
        pendingToken,
        message:
          'Registration successful. Please check your email for verification code.',
      };
    } catch (error) {
      if (auth && !emailSent) {
        try {
          await this.db.auth.delete({ where: { id: auth.id } });
        } catch (error) {
          this.logger.error(
            'Failed to delete auth record after email failure:',
            error,
          );
        }

        throw new InternalServerErrorException(
          'Unable to send verification email. Please try again.',
        );
      }

      this.logger.error('Registration failed:', error);
      throw new InternalServerErrorException(
        'Registration failed. Please try again later.',
      );
    }
  }

  async refreshToken(
    refreshToken: string,
    userAgent: string,
    ipAddress: string,
  ) {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const session = await this.db.session.findFirst({
      where: {
        authId: payload.sub,
        refreshToken,
      },
      include: {
        auth: {
          select: {
            id: true,
            email: true,
            username: true,
            status: true,
            refreshToken: true,
            verified: true,
          },
        },
      },
    });

    if (!session) {
      this.logger.warn(`No active session found for refresh token`);
      throw new UnauthorizedException('Session not found');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    if (session.auth.status !== 'ACTIVE') {
      this.logger.warn(`Account not active: ${session.auth.id}`);
      throw new UnauthorizedException(
        `Account is ${session.auth.status.toLowerCase().replace('_', ' ')}`,
      );
    }

    if (!session.auth.verified) {
      this.logger.warn(`Email not verified: ${session.auth.id}`);
      throw new UnauthorizedException(
        'Email must be verified to refresh token',
      );
    }

    if (session.auth.refreshToken !== refreshToken) {
      this.logger.warn(`Refresh token mismatch for authId: ${session.auth.id}`);

      await this.db.session.deleteMany({
        where: {
          authId: session.auth.id,
        },
      });

      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(
      session.auth.id,
      session.auth.email,
      session.auth.username,
    );

    await this.db.$transaction(async (tx) => {
      await tx.session.update({
        where: { id: session.id },
        data: {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          userAgent,
          ipAddress,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      await tx.auth.update({
        where: { id: session.auth.id },
        data: {
          refreshToken: tokens.refreshToken,
        },
      });
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // invalidate all sessions for a user
  async invalidateSessions(authId: string) {
    try {
      await this.db.session.deleteMany({
        where: {
          authId,
        },
      });

      await this.db.auth.update({
        where: { id: authId },
        data: {
          refreshToken: null,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to invalidate sessions for user ${authId}:`,
        error,
      );
      throw new InternalServerErrorException(
        'Failed to invalidate sessions. Please try again.',
      );
    }
  }

  // verify email
  async verifyEmail(verifyEmailDTO: VerifyEmailDTO) {
    const { authId, code, userAgent, ipAddress } = verifyEmailDTO;
    try {
      const result = await this.db.$transaction(async (tx) => {
        const auth = await tx.auth.findUnique({
          where: { id: authId },
        });

        if (!auth) {
          throw new NotFoundException('Auth record not found');
        }

        if (auth.verified) {
          throw new ConflictException('Email is already verified');
        }

        const verificationCode = await tx.verificationCode.findFirst({
          where: {
            authId,
            code,
            type: 'EMAIL_VERIFICATION',
            used: false,
          },
        });

        if (!verificationCode) {
          throw new NotFoundException('Invalid verification code');
        }

        if (verificationCode.used) {
          throw new ConflictException(
            'Verification code has already been used',
          );
        }

        if (verificationCode.expiresAt < new Date()) {
          throw new ConflictException('Verification code has expired');
        }

        await tx.auth.update({
          where: { id: authId },
          data: { verified: true, verifiedAt: new Date(), status: 'ACTIVE' },
        });

        await tx.verificationCode.update({
          where: { id: verificationCode.id },
          data: { used: true, usedAt: new Date() },
        });

        // Generate tokens
        const tokens = await this.generateTokens(
          auth.id,
          auth.email,
          auth.username,
        );

        const session = await tx.session.create({
          data: {
            authId: auth.id,
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            userAgent,
            ipAddress,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          select: {
            id: true,
            expiresAt: true,
          },
        });

        return {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          sessionId: session.id,
          expiresAt: session.expiresAt,
        };
      });

      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        sessionId: result.sessionId,
        expiresAt: result.expiresAt,
      };
    } catch (error) {
      this.logger.error('Failed to verify email:', error);
      throw error;
    }
  }

  async resendCode(
    authId: string,
    type: string,
    userAgent: string,
    ipAddress: string,
  ) {
    try {
      const auth = await this.db.auth.findUnique({
        where: { id: authId },
      });

      if (!auth) {
        throw new NotFoundException('Auth record not found');
      }

      if (auth.verified) {
        throw new ConflictException('Email is already verified');
      }

      const verificationRecord = await this.db.verificationCode.findFirst({
        where: {
          authId,
          type:
            type === 'email_verification'
              ? 'EMAIL_VERIFICATION'
              : 'PASSWORD_RESET',
          used: false,
        },
        select: {
          id: true,
          expiresAt: true,
          createdAt: true,
          authId: true,
          auth: {
            select: {
              id: true,
              email: true,
              username: true,
              verified: true,
            },
          },
        },
      });

      if (!verificationRecord) {
        throw new NotFoundException('Verification record not found');
      }

      if (verificationRecord.createdAt.getTime() + 60 * 1000 > Date.now()) {
        throw new BadRequestException(
          'Verification code was sent recently. Please wait before requesting a new one.',
        );
      }

      const newCode = await this.generateVerificationCode(
        authId,
        type === 'email_verification' ? 'EMAIL_VERIFICATION' : 'PASSWORD_RESET',
        userAgent,
        ipAddress,
      );

      await this.mailService.sendVerificationEmail(
        auth.email,
        auth.username,
        newCode.code,
      );

      const pendingToken = this.jwtService.sign(
        {
          authId: auth.id,
          type: 'pending_signup',
        },
        {
          expiresIn: `${this.CODE_EXPIRY_MINUTES}m`,
        },
      );

      return {
        pendingToken,
        message: 'Code resent successfully. Please check your email.',
      };
    } catch (error) {
      this.logger.error('Failed to resend verification code:', error);
      throw error;
    }
  }

  //forgot password
  async forgotPassword(email: string, userAgent: string, ipAddress: string) {
    const startTime = Date.now();

    try {
      const auth = await this.db.auth.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!auth) {
        this.logger.warn(
          `Password reset requested for non-existent email: ${email}`,
        );

        const pendingResetToken = this.jwtService.sign(
          {
            fake: true,
            type: 'pending_password_reset',
          },
          {
            expiresIn: `${this.CODE_EXPIRY_MINUTES}m`,
          },
        );

        await this.addConsistentDelay(startTime, 200);
        return {
          pendingResetToken,
          message:
            'If an account exists with this email, you will receive a password reset code.',
        };
      }

      if (auth.status === 'SUSPENDED' || auth.status === 'DEACTIVATED') {
        this.logger.warn(
          `Password reset requested for ${auth.status} account: ${email}`,
        );
        await this.addConsistentDelay(startTime, 200);
        return {
          message:
            'If an account exists with this email, you will receive a password reset code.',
        };
      }

      const verificationCode = await this.generateVerificationCode(
        auth.id,
        'PASSWORD_RESET',
        userAgent,
        ipAddress,
      );

      await this.mailService.sendPasswordResetEmail(
        auth.email,
        auth.username,
        verificationCode.code,
      );

      const pendingResetToken = this.jwtService.sign(
        {
          authId: auth.id,
          email: auth.email,
          codeId: verificationCode.id,
          type: 'password_reset',
        },
        { expiresIn: `${this.CODE_EXPIRY_MINUTES}m` },
      );

      await this.addConsistentDelay(startTime, 200);
      return {
        pendingResetToken,
        message:
          'If an account exists with this email, you will receive a password reset code.',
      };
    } catch (error) {
      this.logger.error('Failed to process password reset request:', error);
      throw new InternalServerErrorException(
        'Unable to process your request. Please try again later.',
      );
    }
  }

  private async addConsistentDelay(startTime: number, targetMs: number) {
    const elapsed = Date.now() - startTime;
    const delay = Math.max(0, targetMs - elapsed);
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  async resetPassword(
    code: string,
    newPassword: string,
    payload: { authId: string; codeId: string },
  ) {
    try {
      const verificationCode = await this.db.verificationCode.findFirst({
        where: {
          code,
          type: 'PASSWORD_RESET',
          used: false,
          authId: payload.authId,
          id: payload.codeId,
        },
        include: {
          auth: {
            select: {
              id: true,
              email: true,
              username: true,
              verified: true,
              sessions: true,
              status: true,
            },
          },
        },
      });

      if (!verificationCode) {
        throw new NotFoundException('Invalid password reset code');
      }

      if (verificationCode.used) {
        throw new ConflictException(
          'Password reset code has already been used',
        );
      }

      if (verificationCode.expiresAt < new Date()) {
        throw new ConflictException('Password reset code has expired');
      }

      if (!verificationCode.auth.verified) {
        throw new UnauthorizedException(
          'Email must be verified before resetting password',
        );
      }

      if (verificationCode.auth.status !== 'ACTIVE') {
        throw new UnauthorizedException(
          'Account is not active. Please contact support.',
        );
      }

      await this.db.$transaction(async (tx) => {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await tx.auth.update({
          where: { id: verificationCode.auth.id },
          data: { password: hashedPassword },
        });

        await tx.verificationCode.update({
          where: { id: verificationCode.id },
          data: { used: true, usedAt: new Date() },
        });

        await tx.session.deleteMany({
          where: {
            authId: verificationCode.auth.id,
          },
        });
      });

      await this.mailService.sendPasswordResetSuccessEmail(
        verificationCode.auth.email,
        verificationCode.auth.username,
        new Date(),
      );

      return {
        success: true,
        message:
          'Password reset successfully. Please log in with your new password.',
      };
    } catch (error) {
      this.logger.error('Password reset failed:', error);

      if (
        error instanceof UnauthorizedException ||
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to reset password. Please try again.',
      );
    }
  }
}
