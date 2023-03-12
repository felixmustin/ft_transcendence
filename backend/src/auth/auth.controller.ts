import { Controller, Get, Post, Body, Request, HttpException, UnauthorizedException, UsePipes, ValidationPipe, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateUserProfileDto } from '../user/dto/create-user-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() body: LoginUserDto) {
    const token = await this.authService.loginUser(body.username, body.wordpass);
    return { token };
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() createUserDto: CreateUserDto) {
    const token = await this.authService.signupUser(createUserDto);
    return { token };
  }

  @Post('signup/profile')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async signupProfile(@Request() req, @Body() createUserProfileDto: CreateUserProfileDto) {
    await this.authService.signupUserProfile(req.user.id, createUserProfileDto);
  }

}