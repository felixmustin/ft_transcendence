import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'myUsername',
      password: 'myPassword',
      database: 'myDatabase',
      entities: [User],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([User]),
  ],
})
export class DatabaseModule {}
