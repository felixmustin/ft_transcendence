import { Injectable, BadRequestException,HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateUserProfileDto } from '../user/dto/create-user-profile.dto';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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

  async loginUser(username: string, wordpass: string) {
   const user = await this.validateUser(username, wordpass)
  return (this.generateAccessToken(user));
  }

  async validateUser(username: string, wordpass: string) {
    const user = await this.userService.findUserByUsername(username);
    const match = await bcrypt.compare(wordpass, user.wordpass);
    if (user && match) {
      return user;
    }
    else
        return null;
  }

  async signupUser(createUserDto: CreateUserDto) {
    if (! await this.isUsernameAvailable(createUserDto.username)) {
        throw new BadRequestException('Username in use');
    }
    const newUser = new User();
    newUser.username = createUserDto.username;
    const hashedPassword = await this.hashPassword(createUserDto.wordpass);
    newUser.wordpass = hashedPassword;
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
    const payload = { id: user.id/* , username: user.username  */};
    return {
      id: user.id,
      access_token: this.jwtService.sign(payload),
      // twoFaEnabled : user.twoFaEnabled
    }
  }

  async hashPassword(wordpass: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(wordpass, salt);
    return hash;
  }

  async validate42User(reqUser: any) {
    const user = await this.userService.find42UserById(reqUser.id);
    if (user)
      return user
    else
      return null
  }

  async logInWith42(reqUser: any) {
      const newUser = new User();
      newUser.user42id = reqUser.id;
      const user = await this.userService.createUser(newUser);

      const newProfile = new Profile();
      newProfile.email = reqUser.email
      newProfile.firstname = reqUser.firstName
      newProfile.lastname = reqUser.lastName
      newProfile.age = reqUser.age;
      const savedProfile = await this.userService.createUserProfile(newProfile);
      user.profile = savedProfile;
      await this.userRepository.save(user);
      return (user);
  }

  async signUpWith42(reqUser: any, username: string) {
    console.log("Bien")
    console.log(reqUser)
    const user = await this.userService.findUserById(reqUser.id);
    user.username = username;
    await this.userRepository.save(user);
  }
  
}