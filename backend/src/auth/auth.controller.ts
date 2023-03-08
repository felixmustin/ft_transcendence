import { Controller, Post, Body, HttpException, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginUserDto: LoginUserDto) {
    const token = await this.authService.loginUser(loginUserDto);
    return { token };
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() createUserDto: CreateUserDto) {
    const token = await this.authService.signupUser(createUserDto);
    return { token };
  }

}