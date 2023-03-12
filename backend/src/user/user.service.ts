import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
// import { CreateUserProfileDto } from './dto/create-user-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private userProfileRepository: Repository<Profile>,

  ) {}

  async allUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(user: User): Promise<User> {
    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async createUserProfile(profile: Profile): Promise<Profile> {
    const savedProfile = await this.userProfileRepository.save(profile);
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
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
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

