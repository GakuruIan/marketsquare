import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import { Response, Request } from 'express';

// decorators
import { UserAgent } from '@/common/decorators/user-agent.decorator';
import { IpAddress } from '@/common/decorators/ip-address.decorator';

// service
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

// DTO
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
    @IpAddress() ipAddress: string,
  ) {
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const payload = this.jwtService.verify(accessToken);
      return { payload };
    } catch (err) {
      if (!refreshToken) throw new UnauthorizedException('Not authenticated');

      const result = await this.authService.refreshToken(
        refreshToken,
        userAgent,
        ipAddress,
      );

      if (!result) throw new UnauthorizedException('Invalid session');

      res.clearCookie('access_token', { path: '/' });
      res.clearCookie('refresh_token', { path: '/' });

      res.cookie('access_token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
        path: '/',
      });

      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return {
        message: 'Token refreshed Successfully',
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        tokenType: 'Bearer',
      };
    }
  }

  @Post('login')
  async login(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
    @IpAddress() ipAddress: string,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      loginDTO,
      userAgent,
      ipAddress,
    );

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1 * 60 * 60 * 1000,
       path: '/',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return { user, message: 'Login successful' };
  }

  @Post('register')
  async register(
    @Body() registerDTO: RegisterDTO,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
    @IpAddress() ipAddress: string,
  ) {
    const result = await this.authService.register(
      registerDTO,
      userAgent,
      ipAddress,
    );

    const { pendingToken, ...payload } = result;

    res.cookie('pendingToken', pendingToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });

    return {
      ...payload,
      message:
        'Registration successful. Please check your email for verification code.',
    };
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Body() body: { code: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
    @IpAddress() ipAddress: string,
  ) {
    const pendingToken = req.cookies?.pendingToken;

    if (!pendingToken) {
      throw new UnauthorizedException('No pending signup session');
    }

    const payload = this.jwtService.verify(pendingToken);

    const verifyEmailDTO = {
      authId: payload.authId,
      code: body.code,
      userAgent: userAgent,
      ipAddress: ipAddress,
    };

    const { accessToken } = await this.authService.verifyEmail(verifyEmailDTO);

    res.clearCookie('pendingToken');

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1 * 60 * 60 * 1000,
    });

    res.cookie('refresh_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return {
      message: 'Email verified successfully. You can now log in.',
    };
  }

  @Post('resend-code')
  @HttpCode(HttpStatus.OK)
  async resendCode(
    @Body() body: { type: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
    @IpAddress() ipAddress: string,
  ) {
    const pendingToken = req.cookies?.pendingToken;

    if (!pendingToken) {
      throw new UnauthorizedException('No pending session');
    }

    const payload = this.jwtService.verify(pendingToken);

    const result = await this.authService.resendCode(
      payload.authId,
      body.type,
      userAgent,
      ipAddress,
    );

    const { pendingToken: newPendingToken, message } = result;

    res.clearCookie('pendingToken');

    res.cookie('pendingToken', newPendingToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });

    return { message };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: { email: string },
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
    @IpAddress() ipAddress: string,
  ) {
    const result = await this.authService.forgotPassword(
      body.email,
      userAgent,
      ipAddress,
    );

    const { pendingResetToken, message } = result;

    res.cookie('pendingResetToken', pendingResetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return { message };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { code: string; newPassword: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const pendingResetToken = req.cookies?.pendingResetToken;

    if (!pendingResetToken) {
      throw new UnauthorizedException('No pending password reset session');
    }

    let tokenPayload: any;
    try {
      tokenPayload = this.jwtService.verify(pendingResetToken);
    } catch (error) {
      res.clearCookie('pendingResetToken');
      throw new UnauthorizedException(
        'Password reset session expired. Please request a new code.',
      );
    }

    if (tokenPayload.fake) {
      throw new UnauthorizedException('Invalid password reset session.');
    }

    const result = await this.authService.resetPassword(
      body.code,
      body.newPassword,
      { authId: tokenPayload.authId, codeId: tokenPayload.codeId },
    );

    res.clearCookie('pendingResetToken');

    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @UserAgent() userAgent: string,
    @IpAddress() ipAddress: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const refresh_token = req.cookies?.refresh_token;

    if (!refresh_token) {
      throw new UnauthorizedException('No refresh token found');
    }

    const result = await this.authService.refreshToken(
      refresh_token,
      userAgent,
      ipAddress,
    );

    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      message: 'Token refreshed Successfully',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      tokenType: 'Bearer',
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const token = req.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('No access token found');
    }

    const payload = this.jwtService.verify(token);

    await this.authService.invalidateSessions(payload.sub);

    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });

    return { message: 'Logged out successfully' };
  }

  @Post('invalidate-sessions')
  async invalidateSessions(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const token = req.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('No access token found');
    }

    const payload = this.jwtService.verify(token);

    await this.authService.invalidateSessions(payload.sub);

    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });

    return { message: 'All sessions invalidated successfully' };
  }
}
