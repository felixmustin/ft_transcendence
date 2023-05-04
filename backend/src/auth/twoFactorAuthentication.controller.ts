import {
    ClassSerializerInterceptor,
    Controller,
    Post,
    UseInterceptors,
    UseGuards,
    Req,
    Response,
    UnauthorizedException,
    Body,
    HttpCode,
    Request,
    Get,
  } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { TwoFactorAuthenticationCodeDto } from './dto/twoFactorAuthenticationCode.dto';
import { TwoFaGuards } from './guards/2fa-auth.guards';
   
  @Controller('2fa')
  @UseInterceptors(ClassSerializerInterceptor)
  export class TwoFactorAuthenticationController {
    constructor(
      private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
      private readonly authService: AuthService,
      private readonly userService: UserService
    ) {}
   
    @Get('generate')
    @UseGuards(JwtAuthGuard)
    async register(@Response() response: Response, @Req() request) {
      const { secret, otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user.id);
      return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
    }

    @Get('generate-login')
    @UseGuards(TwoFaGuards)
    async registerLogin(@Response() response: Response, @Request() req) {      
      const { secret, otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(req.user.id);
      return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
    }

    @Post('turn-on')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async turnOnTwoFactorAuthentication( @Req() request, @Body() body: TwoFactorAuthenticationCodeDto) {
        const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
            body.code, request.user.id
        );   
        if (!isCodeValid) {
          throw new UnauthorizedException('Wrong authentication code');
        }
        await this.userService.turnOn2FA(request.user.id);
    }

    @Post('turn-off')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async turnOffTwoFactorAuthentication( @Req() request, @Body() body: TwoFactorAuthenticationCodeDto) {
        const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
            body.code, request.user.id
        );
        if (!isCodeValid) {
        throw new UnauthorizedException('Wrong authentication code');
        }
        await this.userService.turnOff2FA(request.user.id);
    }

    @Post('authenticate')
    @HttpCode(200)
    @UseGuards(TwoFaGuards)
    async authenticate(@Body() body, @Request() req) {
        const user = await this.userService.findUserById(req.user.id)
        if (!user) {
          throw new UnauthorizedException('User not authorized');
        }
        if (!body.code)
          throw new UnauthorizedException('Wrong authentication code');
        const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(body.code, user.id);
        if (!isCodeValid) {
          throw new UnauthorizedException('Wrong authentication code');
        }
        const token = await this.authService.generateAccessToken(user)

        return { token };
    }
}