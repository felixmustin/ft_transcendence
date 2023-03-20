import {
    ClassSerializerInterceptor,
    Controller,
    Header,
    Post,
    UseInterceptors,
    Res,
    UseGuards,
    Req,
    Response,
    UnauthorizedException,
    Body,
    HttpCode,
  } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { TwoFactorAuthenticationCodeDto } from './dto/twoFactorAuthenticationCode.dto';
   
  @Controller('2fa')
  @UseInterceptors(ClassSerializerInterceptor)
  export class TwoFactorAuthenticationController {
    constructor(
      private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
      private readonly authService: AuthService,
      private readonly userService: UserService
    ) {}
   
    @Post('generate')
    @UseGuards(JwtAuthGuard)
    async register(@Response() response: Response, @Req() request) {
      const { secret, otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);
   
      return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
    }

    @Post('turn-on')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async turnOnTwoFactorAuthentication(
        @Req() request,
        @Body() body: TwoFactorAuthenticationCodeDto
    ) {
        const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
            body.code, request.user.id
        );
        if (!isCodeValid) {
        throw new UnauthorizedException('Wrong authentication code');
        }
        await this.userService.turnOn2FA(request.user.id);
    }

    @Post('authenticate')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async authenticate(
        @Req() request,
        @Body() body: TwoFactorAuthenticationCodeDto
    ) {
        const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
          body.code, request.user.id
        );
        if (!isCodeValid) {
          throw new UnauthorizedException('Wrong authentication code');
        }
        return request.user;
    }
}