import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
// import { Avatar } from 'src/entities/avatar.entity';
import { Profile } from 'src/entities/profile.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
// import { AvatarService } from './avatar.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private userProfileRepository: Repository<Profile>,
    // private avatarService: AvatarService,
  ) {}

  async allUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(user: User): Promise<User> {
    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async createUserProfile(email: string, firstname: string, lastname: string, age:number, filepath: string): Promise<Profile> {
    const newProfile = new Profile();
    newProfile.email = email;
    newProfile.firstname = firstname;
    newProfile.lastname = lastname;
    newProfile.age = age;
    newProfile.avatar = readFileSync(filepath);//await this.avatarService.createDefaultAvatar(filepath)
    const savedProfile = await this.userProfileRepository.save(newProfile);
    return savedProfile;
  }
  
  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
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

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username: username} });
    return user;
  }

  async find42UserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user42id: id } });
    return user;
  }

  async updateUserProfile(id: number, profile: Profile): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    user.profile = profile
    return await this.userRepository.save(user);
  }

  async updateAvatar(id: number, file: Buffer): Promise<User> {
    const userProfile = await this.findUserProfileById(id)
    userProfile.avatar = file;
    const profile = await this.userProfileRepository.save(userProfile);
    return await this.updateUserProfile(id, profile)
  }

  async remove(id: number): Promise<User> {
    const user = await this.userRepository.createQueryBuilder("user")
    .leftJoinAndSelect("user.profile", "profile")
    .where("user.id = :id", { id: id })
    .getOne();
    this.userProfileRepository.remove(user.profile)
    return await this.userRepository.remove(user);
  }

}

