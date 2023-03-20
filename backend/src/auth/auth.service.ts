import { Injectable, BadRequestException,HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateUserProfileDto } from '../user/dto/create-user-profile.dto';
import { User } from '../entities/user.entity';
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
   if (!user)
      throw new BadRequestException('Username or password incorrect');
    
    return (this.generateAccessToken(user));
  }

  async validateUser(username: string, wordpass: string) {
    const user = await this.userService.findUserByUsername(username);
    if (!user)
      return null;
    const match = await bcrypt.compare(wordpass, user.wordpass);
    if (match)
      return user;
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
    const defaultAvatar = "./assets/default-avatar.png"
    const savedProfile = await this.userService.createUserProfile(createUserProfileDto.email, createUserProfileDto.firstname, createUserProfileDto.lastname, createUserProfileDto.age, defaultAvatar);
    await this.userService.updateUserProfile(id, savedProfile)
  }

  private async isUsernameAvailable(email: string): Promise<boolean> {
    const user = await this.userService.findUserByUsername(email);
    if (user) { return false; }
    return true;
  }

  async generateAccessToken(user: User/* ,isTwoFaAuth = false */) {
    const payload = { id: user.id };
    return {
      id: user.id,
      access_token: this.jwtService.sign(payload),
      twoFaEnabled : user.is2faenabled,
      // isTwoFaAuth,
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
      const defaultAvatar = "./assets/default-avatar.png"
      const savedProfile = await this.userService.createUserProfile(reqUser.email, reqUser.firstName, reqUser.lastName, 0, defaultAvatar);
      await this.userService.updateUserProfile(user.id, savedProfile)
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