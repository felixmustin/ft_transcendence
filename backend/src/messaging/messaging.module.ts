import { Module } from '@nestjs/common';
import { MessageService } from './message/message.service';
import { MessageController } from './message/message.controller';
import { ChatRoomController } from './chatroom/chatroom.controller';
import { ChatRoomService } from './chatroom/chatroom.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { ChatRoom } from 'src/entities/chatroom.entity';
import { User } from 'src/entities/user.entity';
import { ChatGateway } from './chat/chat.gateway';
import { UserService } from 'src/user/user.service';
import { Profile } from 'src/entities/profile.entity';
import { Mute } from 'src/entities/mute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, ChatRoom, User, Profile, Mute])],
  providers: [MessageService, ChatRoomService, UserService, ChatGateway],
  controllers: [MessageController, ChatRoomController]
})
export class MessagingModule {}
