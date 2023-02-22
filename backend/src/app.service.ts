import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { users } from './user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(users)
    private usersRepository: Repository<users>,
  ) {}

  async getAllUsers(): Promise<users[]> {
    return this.usersRepository.find();
  }
}