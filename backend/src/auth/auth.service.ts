import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
// import { User } from '../user/user.entity';


@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async loginUser(loginUserDto: LoginUserDto): Promise<string> {
    const { username, wordpass } = loginUserDto;
    const user = await this.userService.findUserByUsername(username);
    if (user && user.wordpass === wordpass) {
      return ('Authenticated');
    }
    else
        throw new UnauthorizedException('Invalid username or password');
  }
}