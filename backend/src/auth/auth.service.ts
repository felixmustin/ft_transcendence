import { Injectable, UnauthorizedException, BadRequestException,HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateUserProfileDto } from '../user/dto/create-user-profile.dto';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

export interface JwtPayload {
  id: number
	// isTwoFaAuthenticated : boolean
}

@Injectable()
export class AuthService {
  
  constructor(
    private userService: UserService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService) {
  }

  private readonly client_id = 'u-s4t2ud-a8ab94043b51e2f7e520f7f5c251c46d28c61cd4c12f3fa4e0812aae34d4956f';
  private readonly redirect_uri = 'http://localhost:3001/auth/42/callback';

  async loginUser(username: string, wordpass: string) {
   const user = await this.validateUser(username, wordpass)
  return (this.generateAccessToken(user));
  }

  async validateUser(username: string, wordpass: string) {
    const user = await this.userService.findUserByUsername(username);
    if (user && user.wordpass === wordpass) {
      return user;
    }
    else
        return null;
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
    return this.generateAccessToken(user);
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
    const savedProfile = await this.userService.createUserProfile(newProfile);
    user.profile = savedProfile;
    await this.userRepository.save(user);
  }

  private async isUsernameAvailable(email: string): Promise<boolean> {
    const user = await this.userService.findUserByUsername(email);
    if (user) { return false; }
    return true;
  }

  async generateAccessToken(user: User/*,isTwoFaAuth = false*/) {
    const payload = { id: user.id, username: user.username };
    return {
      id: user.id,
      access_token: this.jwtService.sign(payload),
      // twoFaEnabled : user.twoFaEnabled
    }
  }

  async signInWith42() {
    
  }
}