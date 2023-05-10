import { Controller, Delete, Get, Post, Param, Request, UseGuards, ParseIntPipe, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { ChatRoomService } from './chatroom.service';
import { Message } from '../../entities/message.entity';
import { UserService } from 'src/user/user.service';
import { MessageService } from '../message/message.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('chatroom')
export class ChatRoomController {
  constructor(private chatRoomService: ChatRoomService,
    private userService: UserService,
    private messageService: MessageService) {}

  @Post('create/:targetId')
  @UseGuards(JwtAuthGuard)
  async createChatRoomFromUsers(@Request() req: any, @Param('targetId') targetId: number) {
    return await this.chatRoomService.createChatRoomFromUsers(req.user.id, targetId);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createChatRoom(@Request() req: any, @Body() { name, mode, password }: { name: string, mode: string, password: string }) {
    return await this.chatRoomService.createCustomChatRoom(name, mode, password, req.user.id);
  }

  @Get(':roomId/users')
  async getUsersByChatRoom(@Param('roomId') roomId: number) {
    return await this.chatRoomService.getFullProfilesByChatRoomId(roomId);
  }

  @Post('create_public')
  @UseGuards(JwtAuthGuard)
  async createGroupChatRoom(@Request() req: any) {
    return await this.chatRoomService.createGroupChatRoom(req.user.id);
  }

  @Post('addMember')
  @UseGuards(JwtAuthGuard)
  async addMemberToChatRoom(@Request() req: any, @Body() { roomId, username }: { roomId: number, username: string }) {
    return await this.chatRoomService.addMemberToChatRoom(roomId, username, req.user.id)
  }

  @Post('addAdmin')
  @UseGuards(JwtAuthGuard)
  async addAdminToChatRoom(@Request() req: any, @Body() { roomId, username }: { roomId: number, username: string }) {
    return await this.chatRoomService.addAdminToChatRoom(roomId, username, req.user.id)
  }

  @Post('setImage')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateImage(@Request() req: any, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const chatRoom = await this.chatRoomService.updateImageChatRoom(req.user.id, file.buffer, Number(body.roomId))
    return chatRoom;
  }

  @Post('update/name')
  @UseGuards(JwtAuthGuard)
  async updateName(@Request() req: any, @Body() { roomId, roomName }: { roomId: number, roomName: string }) {
    const chatRoom = await this.chatRoomService.updateNameChatRoom(req.user.id, roomId, roomName)
    return chatRoom;
  }

  @Post('update/mode')
  @UseGuards(JwtAuthGuard)
  async updateMode(@Request() req: any, @Body() { roomId, roomMode, roomPassword }: { roomId: number, roomMode: string, roomPassword:string }) {
    const chatRoom = await this.chatRoomService.updateModeChatRoom(req.user.id, roomId, roomMode, roomPassword)
    return chatRoom;
  }

  @Get('admin/list')
  @UseGuards(JwtAuthGuard)
  async getAdminList(@Request() req: any,  @Body() { roomId}: { roomId: number}) {
    const usernameAdminList = await this.chatRoomService.getUsernameAdminList(roomId)
    return usernameAdminList
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
    let chatRoom = await this.chatRoomService.getChatRoomById(roomId);
    chatRoom.last_message = null;
    chatRoom.last_profile = null;
    chatRoom.last_message_id = null;
    chatRoom.last_profile_id = null;
    await this.chatRoomService.updateChatRoom(chatRoom);
    let messages = await this.chatRoomService.getMessagesByChatRoomId(roomId);
    for (let i = 0; i < messages.length; i++) {
      messages[i].chatroom = null;
      await this.messageService.deleteMessageById(messages[i].id);
    }
    return await this.chatRoomService.deleteChatRoomById(roomId);
  }

  @Get('last_message/:roomId')
  async getLastMessageByChatRoomId(@Param('roomId') roomId: number) {
    return await this.chatRoomService.getLastMessageByChatRoomId(roomId);
  }

  @Get(':userId/:targetId')
  async getChatRoomByUsers(@Param('userId') userId: number, @Param('targetId') targetId: number) {
    return await this.chatRoomService.getChatRoomByUsers(userId, targetId);
  }

  @Get(':roomId/all/users/')
  async getUsersByChatRoomId(@Param('roomId') roomId: number) {
    const result = await this.chatRoomService.getProfilesByChatRoomId(roomId);
    return result;
  }
}
