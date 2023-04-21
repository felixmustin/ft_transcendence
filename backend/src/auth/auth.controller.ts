import { Controller, Get, Post, Body, Request, HttpException, UnauthorizedException, UsePipes, ValidationPipe, Param, ParseIntPipe, UseGuards, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateUserProfileDto } from '../user/dto/create-user-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { FortytwoGuard } from './guards/fortytwo.guards';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() body: CreateUserDto) {
    const token = await this.authService.loginUser(body.loginName, body.wordpass);
    if (token)
        return { token };
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() body: CreateUserDto) {
    const token = await this.authService.signupUser(body);
    return { token };
  }

  @Post('signup/profile')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async signupProfile(@Request() req, @Body() createUserProfileDto: CreateUserProfileDto) {
    await this.authService.signupUserProfile(req.user.id, createUserProfileDto);
  }

  @Get('42/login')
  @UseGuards(FortytwoGuard)
  async login42(@Request() req) {
    return req.user
  }

  @Get('42/callback')
  @UseGuards(FortytwoGuard)
  async callback(@Request() req, @Res() res: Response) {
    const user = await this.authService.validate42User(req.user);
    if (!user)
    {
      const newUser = await this.authService.logInWith42(req.user);
      const token = await this.authService.generateAccessToken(newUser)
      res.cookie('token', JSON.stringify(token))
      return res.redirect(`http://localhost:3000/log42page`);
    }
    else
    {
      const token = await this.authService.generateAccessToken(user)
      // if (token.twoFaEnabled == true)
      res.cookie('token', JSON.stringify(token))
      return res.redirect(`http://localhost:3000/log42page`);
    }
  }

  @Post('42/signup')
  @UseGuards(JwtAuthGuard)
  async signUp42(@Request() req, @Body() body) {
    const profile = await this.authService.signUpWith42(req.user, body.username)
    return profile;
  }

  @Post('refresh-token')
  async refreshAccessToken(@Body() body) {
    const refreshToken = body.refreshToken
    if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
    }
    const token = await this.authService.verifyRefreshToken(refreshToken);
    return ( token );
}
}