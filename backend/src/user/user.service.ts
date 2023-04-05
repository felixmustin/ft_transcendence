import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { Profile } from 'src/entities/profile.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
// import { Friends } from '../entities/friends.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private userProfileRepository: Repository<Profile>,
    // @InjectRepository(Friends) private friendsRepository: Repository<Friends>,
  ) {}

  async allUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(user: User): Promise<User> {
    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async createUserProfile(username: string, email: string, firstname: string, lastname: string, age:number, filepath: string): Promise<Profile> {
    const newProfile = new Profile();
    newProfile.username = username;
    newProfile.email = email;
    newProfile.firstname = firstname;
    newProfile.lastname = lastname;
    newProfile.age = age;
    newProfile.avatar = readFileSync(filepath);
    const savedProfile = await this.userProfileRepository.save(newProfile);
    return savedProfile;
  }
  
  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  async findUserByUsername(username: string): Promise<User> {
    const userProfile = await this.findUserProfileByUsername(username)
    const user = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('profile.id = :id', { id: userProfile.id })
      .getOne();
    return user;
  }

  async findUserProfileById(id: number): Promise<Profile> {
    const user = await this.userRepository.createQueryBuilder("user")
    .leftJoinAndSelect("user.profile", "profile")
    .where("user.id = :id", { id: id })
    .getOne();
    const userProfile = user.profile;
    return userProfile;
  }

  async findUserByloginName(loginName: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { loginName: loginName} });
    return user;
  }

  // async findUserByUsername(username: string): Promise<User> {
  //   const userProfile = await this.userProfileRepository.findOne({ where: { username: username} });
  //   return user;
  // }

  async findUserProfileByUsername(username: string): Promise<Profile> {
    const userProfile = await this.userProfileRepository.findOne({ where: { username: username } });

    // const user = await this.userRepository.createQueryBuilder("user")
    // .leftJoinAndSelect("user.profile", "profile")
    // .where("user.username = :username", { username: username })
    // .getOne();
    // const userProfile = user.profile;
    return userProfile;
  }

  async find42UserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user42id: id } });
    return user;
  }

  async updateUserProfile(id: number, profile: Profile): Promise<User> {
    const user = await this.findUserById(id)
    user.profile = profile
    return await this.userRepository.save(user);
  }

  async updateAvatar(id: number, file: Buffer): Promise<User> {
    const userProfile = await this.findUserProfileById(id)
    userProfile.avatar = file;
    const profile = await this.userProfileRepository.save(userProfile);
    return await this.updateUserProfile(id, profile)
  }

  async turnOn2FA(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.is2faenabled = true;
    await this.userRepository.save(user);
  }

  async turnOff2FA(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.is2faenabled = false;
    await this.userRepository.save(user);
  }

  async set2FASecret(secret: string, userId: number): Promise<User> {
    const user = await this.findUserById(userId)
    user.secret2fa = secret;
    return (await this.userRepository.save(user));
  }

  async remove(id: number) {
    const user = await this.userRepository.createQueryBuilder("user")
    .leftJoinAndSelect("user.profile", "profile")
    .where("user.id = :id", { id: id })
    .getOne();
    console.log(user)
    const userProfile = user.profile;
    await this.userRepository.remove(user);
    // this.userProfileRepository.remove(user.profile)
    return await this.userProfileRepository.remove(userProfile)//await this.userRepository.remove(user);
  }

}
