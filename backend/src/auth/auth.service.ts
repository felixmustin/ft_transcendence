import { Injectable, UnauthorizedException, BadRequestException,HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateUserProfileDto } from '../user/dto/create-user-profile.dto';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User) private userRepository: Repository<User>,) {
  }

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

  async signupUserProfile(id: number, createUserProfileDto: CreateUserProfileDto) {
    const user = await this.userRepository.findOneBy({ id })
    if (!user)
      throw new HttpException('User not found. Cannot create profile', HttpStatus.BAD_REQUEST)
    const newProfile = new Profile();
    newProfile.email = createUserProfileDto.email;
    newProfile.firstname = createUserProfileDto.firstname;
    newProfile.lastname = createUserProfileDto.lastname;
    newProfile.age = createUserProfileDto.age;
    const userSaved = await this.userService.createUserProfile(user, newProfile);
    return (userSaved);
  }

  private async isUsernameAvailable(email: string): Promise<boolean> {
    const user = await this.userService.findUserByUsername(email);
    if (user) { return false; }
    return true;
  }

}