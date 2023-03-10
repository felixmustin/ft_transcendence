import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../entities/user.entity';


@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async loginUser(loginUserDto: LoginUserDto) {
    const { username, wordpass } = loginUserDto;
    const user = await this.userService.findUserByUsername(username);
    if (user && user.wordpass === wordpass) {
      return (user);
    }
    else
        throw new UnauthorizedException('Invalid username or password');
  }

  async signupUser(createUserDto: CreateUserDto) {
    if (! await this.isUsernameAvailable(createUserDto.username)) {
        throw new BadRequestException('Username in use');
    }
    // const encryptedPassword = await this.encryptPassword(createUserDto.wordpass);
    const newUser = new User();
    newUser.username = createUserDto.username;
    newUser.wordpass = createUserDto.wordpass; // encryptedPassword
    const user = await this.userService.createUser(newUser);
    return (user);
  }

  private async isUsernameAvailable(email: string): Promise<boolean> {
    const user = await this.userService.findUserByUsername(email);
    if (user) { return false; }
    return true;
  }
}