import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friends } from 'src/entities/friends.entity';
import { Message } from 'src/entities/message.entity';
import { Profile } from 'src/entities/profile.entity';
import { User } from '../entities/user.entity';
import { ChatRoom } from 'src/entities/chatroom.entity';
import { Game } from 'src/entities/game.entity';
import { Mute } from 'src/entities/mute.entity';
import { Ban } from 'src/entities/ban.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'myUsername',
      password: 'myPassword',
      database: 'myDatabase',
      entities: [User, Profile, Friends, ChatRoom, Message, Game, Mute, Ban],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Profile, ChatRoom, Message, Game, Mute, Ban]),
  ],
})
export class DatabaseModule {}
