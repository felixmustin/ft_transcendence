import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TwoFAStrategy extends PassportStrategy(Strategy, '2fa') {
  constructor() {
    super({

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.TWOFA_SECRET,
    });
  }

  async validate(payload: any) {
    return {
        id: payload.id,
      };
  }
}