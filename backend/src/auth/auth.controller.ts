import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const token = await this.authService.loginUser(loginUserDto);
    return { token };
  }
}