import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }

}

