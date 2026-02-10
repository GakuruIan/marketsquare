import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}
  async sendVerificationEmail(
    email: string,
    username: string | null,
    verificationCode: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Verify your email',
        template: './verification-email',
        context: {
          username,
          verificationCode,
          year: new Date().getFullYear(),
          expiryMinutes: 15,
        },
      });

      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${email}: ${error.message}`,
      );
    }
  }

  async sendPasswordResetEmail(
    email: string,
    username: string | null,
    resetCode: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        template: './password-reset-email',
        context: {
          username,
          resetCode,
          year: new Date().getFullYear(),
          expiryMinutes: 15,
        },
      });

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}: ${error.message}`,
      );
    }
  }

  async sendPasswordResetSuccessEmail(
    email: string,
    username: string,
    updateTime: Date,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your password has been reset',
        template: './password-reset-success-email',
        context: {
          username,
          updateTime,
          year: new Date().getFullYear(),
        },
      });

      this.logger.log(`Password reset success email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset success email to ${email}: ${error.message}`,
      );
    }
  }
}
