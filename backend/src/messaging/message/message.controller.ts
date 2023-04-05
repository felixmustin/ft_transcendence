import { Controller, Get, Param, Post, Body, Delete, UseGuards, Request } from '@nestjs/common';
import { MessageService } from './message.service';
import { ChatRoomService } from '../chatroom/chatroom.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatRoomService: ChatRoomService,) {}

  @Post('send/:targetId')
  @UseGuards(JwtAuthGuard)
  async sendMessageToUser(@Request() req: any, @Param('targetId') targetId: number, @Body() createMessageDto: CreateMessageDto) {
    let chatRoom = await this.chatRoomService.getChatRoomByUsers(req.user.id, targetId);
    if (!chatRoom)
      chatRoom = await this.chatRoomService.createChatRoomFromUsers(req.user.id, targetId);
    return await this.messageService.sendToChatRoom(chatRoom, req.user.id, createMessageDto.content);
  }

  @Post('send_room/:roomId')
  @UseGuards(JwtAuthGuard)
  async sendMessageToRoom(@Request() req: any, @Param('roomId') roomId: number, @Body() createMessageDto: CreateMessageDto) {
    let chatRoom = await this.chatRoomService.getChatRoomById(roomId);
    if (!chatRoom)
      chatRoom = await this.chatRoomService.createGroupChatRoom(req.user.id);
    return await this.messageService.sendToChatRoom(chatRoom, req.user.id, createMessageDto.content);
  }

  // Use because Auth Guard is not working
  @Post('send/:targetId/:userId')
  async sendMessageToUserNoGuard(@Param('targetId') targetId: number, @Param('userId') userId: number, @Body() createMessageDto: CreateMessageDto) {
    let chatRoom = await this.chatRoomService.getChatRoomByUsers(userId, targetId);
    if (!chatRoom)
      chatRoom = await this.chatRoomService.createChatRoomFromUsers(userId, targetId);
    return await this.messageService.sendToChatRoom(chatRoom, userId, createMessageDto.content);
  }




  //@Post('create')
  //async createMessage(@Body() createMessageDto: CreateMessageDto) {
  //  let chatRoom = await this.chatRoomService.getChatRoomByRoomId(
  //    createMessageDto.chatRoomId
  //  );
  //  if (!chatRoom) {
  //    chatRoom = await this.chatRoomService.createChatRoom(
  //      createMessageDto.senderId, createMessageDto.targetId
  //    );
  //  }
  //  console.log(`Sender ID: ${createMessageDto.senderId}`);
  //  console.log(`Conversation ID: ${chatRoom.id}`);
  //  return await this.messageService.createMessage(chatRoom.id, createMessageDto.senderId, createMessageDto.content);
  //}

  //@Delete('del/:id')
  //async deleteMessage(@Param('id') id: string) {
  //  return await this.messageService.deleteMessage(id);
  //}

  //@Get('get/:id')
  //async getMessage(@Param('id') id: number) {
  //  return await this.messageService.getMessage(id);
  //}

  //@Get('getAll/:id')
  //async getAllMessages(@Param('id') id: number) {
  //  return await this.messageService.getAllMessages(id);
  //}
}