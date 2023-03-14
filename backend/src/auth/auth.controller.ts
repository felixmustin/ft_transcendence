import { Controller, Get, Post, Body, Request, HttpException, UnauthorizedException, UsePipes, ValidationPipe, Param, ParseIntPipe, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateUserProfileDto } from '../user/dto/create-user-profile.dto';
import { JwtAuthGuard } from './jwt-auth.guards';
import { FortytwoGuard } from './fortytwo.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() body: CreateUserDto) {
    const token = await this.authService.loginUser(body.username, body.wordpass);
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
      const token = this.authService.generateAccessToken(newUser)
      res.cookie('access_token', (await token).access_token)
      return res.redirect(`http://localhost:3000/usernameinput`);
    }
    else
    {
      const token = await this.authService.generateAccessToken(user)
      res.cookie('access_token', (await token).access_token)
      return res.redirect(`http://localhost:3000/home`);
    }
  }

  @Post('42/signup')
  // @UseGuards(AuthGuard('42'))
  @UseGuards(JwtAuthGuard)
  async signUp42(@Request() req, @Body() body) {
    const token = await this.authService.signUpWith42(req.user, body.username)
    return token;
  }

}