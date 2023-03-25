import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { ConversationService } from '../conversation/conversation.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,) {}

  @Post('create')
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    let conversation = await this.conversationService.getConversationByUsers(
      createMessageDto.senderId, createMessageDto.targetId
    );
    if (!conversation) {
      conversation = await this.conversationService.createConversation(
        createMessageDto.senderId, createMessageDto.targetId
      );
    }
    console.log(`Sender ID: ${createMessageDto.senderId}`);
    console.log(`Conversation ID: ${conversation.id}`);
    return await this.messageService.createMessage(conversation.id, createMessageDto.senderId, createMessageDto.content);
  }


  @Delete('del/:id')
  async deleteMessage(@Param('id') id: string) {
    return await this.messageService.deleteMessage(id);
  }

  @Get('get/:id')
  async getMessage(@Param('id') id: number) {
    return await this.messageService.getMessage(id);
  }

  @Get('getAll/:id')
  async getAllMessages(@Param('id') id: number) {
    return await this.messageService.getAllMessages(id);
  }
}