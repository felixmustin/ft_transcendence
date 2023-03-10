import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async createUserProfile(user: User, profile: Profile): Promise<User> {
    const newProfile = await this.userProfileRepository.create(profile);
    const savedProfile = await this.userProfileRepository.save(newProfile);
    user.profile = savedProfile;
    // this.userRepository.save(user);
    return this.userRepository.save(user);;
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  async findUserProfileById(id: number): Promise<Profile> {
    // const user = this.findUserById(id)
    const userProfile = await this.userProfileRepository.findOne({ where: { id } });
    return userProfile;
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }

  async remove(user: User): Promise<User> {
    const userProfile = await this.userProfileRepository.findOne({ where: { id: user.id } });
    this.userProfileRepository.remove(userProfile)
    return await this.userRepository.remove(user);
  }

}

