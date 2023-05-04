import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return {
        id: payload.id,
      };
  }
  public async validateWebSocket(headers: any): Promise<any> {
    const token = headers.authorization.split(' ')[1];
    const payload = await this.validateToken(token);
    return this.validate(payload);
  }

  private async validateToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          throw (new UnauthorizedException());
        } else {
          resolve(payload);
        }
      });
    });
  }
}