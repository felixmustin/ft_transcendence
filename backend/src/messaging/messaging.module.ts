import { Module } from '@nestjs/common';
import { MessageService } from './message/message.service';
import { MessageController } from './message/message.controller';
import { ConversationController } from './conversation/conversation.controller';
import { ConversationService } from './conversation/conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { Conversation } from 'src/entities/conversation.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Conversation, User])],
  providers: [MessageService, ConversationService],
  controllers: [MessageController, ConversationController]
})
export class MessagingModule {}
