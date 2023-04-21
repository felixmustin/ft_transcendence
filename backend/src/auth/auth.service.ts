import { Injectable, BadRequestException,HttpStatus, HttpException, UnauthorizedException } from '@nestjs/common';
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

  async loginUser(loginName: string, wordpass: string) {
   const user = await this.validateUser(loginName, wordpass)
   if (!user)
      throw new BadRequestException('loginName or password incorrect');
    const userNotFinished = (await this.UserNotFinished(loginName))
    if (userNotFinished)
      throw new BadRequestException('Finish signup first');
    return (this.generateAccessToken(user));
  }

  async validateUser(loginName: string, wordpass: string) {
    const user = await this.userService.findUserByloginName(loginName);
    if (!user)
      return null;
    if (!wordpass || !loginName)
      return null;
    const match = await bcrypt.compare(wordpass, user.wordpass);
    if (match)
      return user;
    else
        return null;
  }

  async signupUser(createUserDto: CreateUserDto) {
    if (! await this.isUsernameInUse(createUserDto.loginName)) {
        throw new BadRequestException('Username in use');
    }
    const userNotFinished = (await this.UserNotFinished(createUserDto.loginName))
    if (userNotFinished)
    {
      if (await this.validateUser(createUserDto.loginName, createUserDto.wordpass))
        return this.generateAccessToken(userNotFinished);
      else
        throw new BadRequestException('Username in use');
    }
    const newUser = new User();
    newUser.loginName = createUserDto.loginName;
    const hashedPassword = await this.hashPassword(createUserDto.wordpass);
    newUser.wordpass = hashedPassword;
    newUser.statusid = 0;
    const user = await this.userService.createUser(newUser);
    return this.generateAccessToken(user);
  }
  
  async signupUserProfile(id: number, createUserProfileDto: CreateUserProfileDto) {
    const user = await this.userRepository.findOneBy({ id })
    if (!user)
      throw new HttpException('User not found. Cannot create profile', HttpStatus.BAD_REQUEST)
    const defaultAvatar = "./assets/default-avatar.png"
    const savedProfile = await this.userService.createUserProfile(user.loginName, createUserProfileDto.email, createUserProfileDto.firstname, createUserProfileDto.lastname, createUserProfileDto.age, defaultAvatar);
    await this.userService.updateUserProfile(id, savedProfile)
  }


  private async isUsernameInUse(username: string): Promise<boolean> {
    const userProfile = await this.userService.findUserProfileByUsername(username);
    if (userProfile)
      return false;
    return true;
  }

  private async UserNotFinished(username: string): Promise<User> {
    const user = await this.userService.findUserByloginName(username);
    const userProfile = await this.userService.findUserProfileByUsername(username);
    if (user && !userProfile)
      return user;
    return null;
  }

  
  async generateAccessToken(user: User) {
    const payload = { id: user.id, twoFaEnabled: user.is2faenabled, expiresIn: '15m'};
    const accessToken = this.jwtService.sign(payload);

    this.userService.changeStatus(user, 1);
    const refreshToken = await this.generateRefreshToken(user)

    return { accessToken, refreshToken };
  }

  async generateRefreshToken(user: User) {
    const payload = { id: user.id, expiresIn: '7d'};
    const refreshToken = this.jwtService.sign(payload)

    user.refreshtoken = refreshToken
    await this.userRepository.save(user)
    return refreshToken;
  }

  async verifyRefreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);
    if (!payload) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.userService.findUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    if (user.refreshtoken != refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    // Check if the refresh token is still valid
    if (Date.now() >= payload.expiresIn * 1000) {
      throw new UnauthorizedException('Expired refresh token');
    }
    // Generate a new access token with the same payload as before
    return this.generateAccessToken(user);
  }

  // async generateAccessTokenFromRefreshToken(refreshToken: string) {
  //   const decoded = this.jwtService.verify(refreshToken, { secret: 'myRefreshSecret' });
  //   const user = await this.userService.findById(decoded.id);
  
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid refresh token');
  //   }
  
  //   const accessToken = {
  //     id: user.id,
  //     access_token: this.jwtService.sign({ id: user.id }, { expiresIn: '15m' }),
  //     twoFaEnabled: user.is2faenabled,
  //     expiresIn: '15m'
  //   };
  
  //   return accessToken;
  // }

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
      newUser.statusid = 0;
      const user = await this.userService.createUser(newUser);
      const defaultAvatar = "./assets/default-avatar.png"
      const savedProfile = await this.userService.createUserProfile('', reqUser.email, reqUser.firstName, reqUser.lastName, 0, defaultAvatar);
      await this.userService.updateUserProfile(user.id, savedProfile)
      savedProfile.username = "Default" + savedProfile.id;
      await this.userService.updateUserProfile(user.id, savedProfile)
      return (user);
  }

  async signUpWith42(reqUser: any, username: string) {
    console.log(reqUser)
    const userProfile = await this.userService.findUserProfileById(reqUser.id);
    const userNotFinished = (await this.UserNotFinished(username))
    if ((! await this.isUsernameInUse(username) ) || userNotFinished) {
      throw new BadRequestException('Username in use');
    }
    userProfile.username = username;
    return await this.userService.updateUserProfile(reqUser.id, userProfile)
  }
}