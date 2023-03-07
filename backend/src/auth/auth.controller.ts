import { Controller, Post, Body, HttpException, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginUserDto: LoginUserDto) {
    console.log(Request);
    console.log(loginUserDto.username);
    console.log(loginUserDto.wordpass);
    console.log("salut");
    const token = await this.authService.loginUser(loginUserDto);
    return { token };
  }
}