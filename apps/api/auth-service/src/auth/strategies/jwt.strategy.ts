import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  authId: string;
  username: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private readonly db: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const auth = await this.db.auth.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        username: true,
        email: true,
        verified: true,
        status: true,
      },
    });

    if (!auth) {
      throw new NotFoundException('No User found');
    }

    if (auth.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    if (!auth.verified) {
      throw new UnauthorizedException('Email not verified');
    }

    return {
      authId: payload.sub,
      email: auth.email,
      username: auth.username,
    };
  }
}
