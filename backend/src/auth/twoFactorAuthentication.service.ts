import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../entities/user.entity';
import { UserService } from '../user/user.service';
import { toFileStream } from 'qrcode';
 
@Injectable()
export class TwoFactorAuthenticationService {
  constructor (
    private readonly userService: UserService,
  ) {}
 
  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const profile = this.userService.findUserProfileById(user.id)
    const otpauthUrl = authenticator.keyuri((await profile).email, 'AUTH_APP_NAME', secret);
 
    const savedUser  = await this.userService.set2FASecret(secret, user.id);
    return {
      secret,
      otpauthUrl
    }
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  public async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, userId: number) {
    const user = await this.userService.findUserById(userId)

    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.secret2fa
    })
  }
}