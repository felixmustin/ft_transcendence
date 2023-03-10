import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';

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

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  async findUserProfileById(id: number): Promise<Profile> {
    const userProfile = await this.userProfileRepository.findOne({ where: { id } });
    return userProfile;
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }

  async createUserProfile(id: number, createUserProfileDto: CreateUserProfileDto) {
    const user = await this.userRepository.findOneBy({ id })
    if (!user)
      throw new HttpException('User not found. Cannot create profile', HttpStatus.BAD_REQUEST)

    const newProfile = new Profile();
    newProfile.email = createUserProfileDto.email;
    newProfile.firstname = createUserProfileDto.firstname;
    newProfile.lastname = createUserProfileDto.lastname;
    newProfile.age = createUserProfileDto.age;
      
    const newPro = this.userProfileRepository.create(newProfile);
    const savedProfile = await this.userProfileRepository.save(newPro);
    user.profile = savedProfile;
    console.log(user.profile);
    return this.userRepository.save(user);
  }
}

