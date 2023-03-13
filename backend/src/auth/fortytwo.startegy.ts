import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { VerifyCallback } from 'passport-jwt';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
    super({
      clientID: 'u-s4t2ud-77bf09879c85b0614b043b32b13aafeeca1045661308be6440195c574f88eb76',//'u-s4t2ud-a8ab94043b51e2f7e520f7f5c251c46d28c61cd4c12f3fa4e0812aae34d4956f',
      clientSecret: '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',//'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',
      callbackURL: 'http://localhost:3001/auth/42/callback',
    });
  }

  async validate(accessToken: string,
  refreshToken: string,
  profile: any,
  done: VerifyCallback): Promise<any> {
    console.log("salut");
    const {id, emails, username, photos } = profile
    const user = {
      sub: id,
      email: emails[0].value,
			username: username,
      picture: photos[0].value,
      accessToken,
      refreshToken,
		}
    return (user);
  }
  
}
