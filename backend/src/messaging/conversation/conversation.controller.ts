import { Controller, Delete, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { ConversationService } from './conversation.service';

@Controller('conversations')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Get(':userId')
  async getAllConversations(@Param('userId') userId: number) {
    return await this.conversationService.getAllConversationsByUserId(userId);
  }

  @Get('conv/:Id')
  async getConversation(@Param('Id') userId: number) {
    return await this.conversationService.getConversationByConvId(userId);
  }

  @Get('create/:userId')
  @UseGuards(JwtAuthGuard)
  async createConversation(@Param('userId') userId: number, @Request() req: any) {
    return await this.conversationService.createConversation(userId, req.user.id);
  }

  @Delete(':conversationId')
  async deleteConversation(@Param('conversationId') conversationId: number) {
    return await this.conversationService.deleteConversation(conversationId);
  }

  @Delete('all/:userId')
  async deleteAllConversations(@Param('userId') conversationId: number) {
    return await this.conversationService.deleteConversation(conversationId);
  }
}
