import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';


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

  async signupUser(createUserDto: CreateUserDto) {
    if (! await this.isUsernameAvailable(createUserDto.username)) {
        throw new BadRequestException('Username in use');
    }
    // const encryptedPassword = await this.encryptPassword(createUserDto.wordpass);
    
    const newUser = new User();
    newUser.email = createUserDto.email;
    newUser.username = createUserDto.username;
    newUser.firstname = createUserDto.firstname;
    newUser.lastname = createUserDto.lastname;
    newUser.wordpass = createUserDto.wordpass; // encryptedPassword
    const user = await this.userService.createUser(newUser);
    return (user.id);
  }

  private async isUsernameAvailable(email: string): Promise<boolean> {
    const user = await this.userService.findUserByUsername(email);
    if (user) { return false; }
    return true;
  }

}