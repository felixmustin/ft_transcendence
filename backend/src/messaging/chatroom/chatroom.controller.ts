import { Controller, Delete, Get, Post, Param, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { ChatRoomService } from './chatroom.service';
import { Message } from '../../entities/message.entity';

@Controller('chatroom')
export class ChatRoomController {
  constructor(private chatRoomService: ChatRoomService) {}

  @Post('create/:targetId')
  @UseGuards(JwtAuthGuard)
  async createChatRoomFromUsers(@Request() req: any, @Param('targetId') targetId: number) {
    return await this.chatRoomService.createChatRoomFromUsers(req.user.id, targetId);
  }

  // Use because Auth Guard is not working
  @Post('create/:targetId/:userId')
  async createChatRoomFromUsersWithoutAuth(@Param('targetId') targetId: number, @Param('userId') userId: number) {
    return await this.chatRoomService.createChatRoomFromUsers(userId, targetId);
  }

  @Post('create_public')
  @UseGuards(JwtAuthGuard)
  async createGroupChatRoom(@Request() req: any) {
    return await this.chatRoomService.createGroupChatRoom(req.user.id);
  }

  @Get('all')
  async getAllChatRooms() {
    return await this.chatRoomService.getAllChatRooms();
  }

  @Get('room/:Id')
  async getChatRoomById(@Param('Id') roomId: number) {
    return await this.chatRoomService.getChatRoomById(roomId);
  }

  @Get('all_my_rooms')
  @UseGuards(JwtAuthGuard)
  async getAllChatRoomsByMyUser(@Request() req: any) {
    return await this.chatRoomService.getAllChatRoomsByUserId(req.user.id);
  }
  

  @Get(':id/messages')
  async getMessagesByChatRoomId(@Param('id', ParseIntPipe) chatRoomId: number): Promise<Message[]> {
  return this.chatRoomService.getMessagesByChatRoomId(chatRoomId);
}

  @Get('all_rooms/:userId')
  async getAllChatRoomsByUserId(@Param('userId') userId: number) {
    return await this.chatRoomService.getAllChatRoomsByUserId(userId);
  }

  @Delete(':roomId')
  async deleteChatRoomById(@Param('roomId') roomId: number) {
    return await this.chatRoomService.deleteChatRoomById(roomId);
  }

  @Get('last_message/:roomId')
  async getLastMessageByChatRoomId(@Param('roomId') roomId: number) {
    return await this.chatRoomService.getLastMessageByChatRoomId(roomId);
  }
}
