import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'myUsername',
      password: 'myPassword',
      database: 'myDatabase',
      entities: [User, Profile],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([User]),
  ],
})
export class DatabaseModule {}
