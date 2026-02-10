import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'usernameOrEmail',
      passwordField: 'password',
    });
  }

  async validate(usernameOrEmail: string, password: string): Promise<any> {
    const auth = this.authService.validateUser(usernameOrEmail, password);

    if (!auth) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return auth;
  }
}
