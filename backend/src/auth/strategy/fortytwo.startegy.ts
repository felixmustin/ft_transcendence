import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { VerifyCallback } from 'passport-jwt';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
    super({
      clientID: 'u-s4t2ud-77bf09879c85b0614b043b32b13aafeeca1045661308be6440195c574f88eb76',
      clientSecret: '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',
      callbackURL: 'http://localhost:3001/auth/42/callback',
      profileFields: {
        'id': function (obj) { return String(obj.id); },
        'displayName': 'displayname',
        'name.familyName': 'last_name',
        'name.givenName': 'first_name',
        'profileUrl': 'url',
        'emails.0.value': 'email',
        'phoneNumbers.0.value': 'phone',
        'photos.0.value': 'image'
      }
    });
  }

  async validate(accessToken: string,
  refreshToken: string,
  profile: any,
  done: VerifyCallback): Promise<any> {

    const user = {
        id: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        accessToken,
        refreshToken
      };
    return (user);
  }
  
}
