import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { MessageService } from "../message/message.service";
import { ChatRoomService } from "../chatroom/chatroom.service";
import { Server, Socket } from "socket.io";
import { handshake } from "src/pong/pong.service";

@WebSocketGateway({ namespace: "/chat" })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private messageService: MessageService,
    private chatRoomService: ChatRoomService
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log("ChatGateway initialized");
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("join_room")
  handleJoinRoom(client: Socket, roomId: number) {
    client.join(roomId.toString());
    console.log(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage("leave_room")
  handleLeaveRoom(client: Socket, roomId: number) {
    client.leave(roomId.toString());
    console.log(`Client ${client.id} left room ${roomId}`);
  }

  @SubscribeMessage('send_message')
  async sendMessage(client: Socket, payload: { chatroomId: number; senderId: number, content: string }): Promise<void> {
    try {
      const { chatroomId, senderId, content } = payload;
      console.log('sendMessage payload:', chatroomId, senderId, content );
      if (!chatroomId) {
        console.error('sendMessage error: chatroomId is undefined');
        return;
      }
      const newMessage = await this.messageService.sendToChatRoom(chatroomId, senderId, content);
      const updatedMessages = await this.chatRoomService.getMessagesByChatRoomId(chatroomId);
      if (updatedMessages.length === 1)
        this.server.emit('new_chatroom');
      this.server.to(chatroomId.toString()).emit('update_conversation', updatedMessages);
      this.server.emit('update_last_message', { roomId: chatroomId, lastMessage: newMessage });
    } catch (error) {
      console.error('sendMessage error:', error);
    }
  }
  @SubscribeMessage('handshake')
  async handshake(client: Socket, payload: string){
    const response : handshake = {
      uid: client.id,
      users: [],
      data: '' // you can put anything you want here with JSON.stringify
    }
    client.emit('handshake-response', response);
  }
}






//import {
//  WebSocketGateway,
//  WebSocketServer,
//  SubscribeMessage,
//  OnGatewayInit,
//  OnGatewayConnection,
//  OnGatewayDisconnect,
//} from '@nestjs/websockets';
//import { Logger } from '@nestjs/common';
//import { Socket, Server } from 'socket.io';
//import { ChatRoomService } from '../chatroom/chatroom.service';
//import { MessageService } from '../message/message.service';

//@WebSocketGateway({ namespace: '/chat' })
//export class ChatGateway
//  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

//  constructor(
//    private readonly messageService: MessageService,
//    private readonly chatRoomService: ChatRoomService,
//  ) {}

//  @WebSocketServer()
//  server: Server;

//  private logger: Logger = new Logger('ChatGateway');

//  afterInit(server: Server) {
//    this.logger.log('Initialized!');
//  }

//  handleConnection(client: Socket, ...args: any[]) {
//    this.logger.log(`Client connected: ${client.id}`);
//  }

//  handleDisconnect(client: Socket) {
//    this.logger.log(`Client disconnected: ${client.id}`);
//  }

//  @SubscribeMessage('chatToServer')
//async handleMessage(
//  client: Socket,
//  payload: { roomId: number; sender: number; targetId: number; message: string },
//): Promise<void> {
//  try {
//    const { roomId, sender, targetId, message } = payload;
//    let chatRoom = await this.chatRoomService.getChatRoomById(roomId);

//    if (!chatRoom && targetId) {
//      chatRoom = await this.chatRoomService.createChatRoomFromUsers(sender, targetId);
//    }

//    if (!chatRoom) {
//      return;
//    }

//    // Join the client to the chat room
//    client.join(chatRoom.id.toString());

//    const { newMessage, updatedChatRoom } = await this.messageService.sendToChatRoom(
//      chatRoom,
//      sender,
//      message,
//    );

//    this.logger.log(`Sending message to chat room ${updatedChatRoom.id}:`, newMessage);

//    this.server.to(updatedChatRoom.id.toString()).emit('chatToClient', newMessage);

//    // Add this line to emit the lastMessageUpdate event
//    this.server.to(updatedChatRoom.id.toString()).emit(`lastMessageUpdate:${updatedChatRoom.id}`, newMessage);
//  } catch (error) {
//    this.logger.error(`Error handling message: ${error.message}`);
//  }
//}


//@SubscribeMessage('joinChatRoom')
//async joinChatRoom(client: Socket, payload: { roomId: number }): Promise<void> {
//  try {
//    const { roomId } = payload;
//    const chatRoom = await this.chatRoomService.getChatRoomById(roomId);

//    if (!chatRoom) {
//      this.logger.warn(`Chat room with ID ${roomId} not found`);
//      return;
//    }

//    client.join(chatRoom.id.toString());
//    this.logger.log(`Client ${client.id} joined chat room ${roomId}`);
//  } catch (error) {
//    this.logger.error(`Error joining chat room: ${error.message}`);
//  }
//}


//  @SubscribeMessage('fetchChatRoomMessages')
//  async fetchChatRoomMessages(
//    client: Socket,
//    payload: { roomId: number },
//  ): Promise<void> {
//    try {
//      const { roomId } = payload;
//      const chatRoom = await this.chatRoomService.getChatRoomById(roomId);

//      if (!chatRoom) {
//        this.logger.warn(`Chat room with ID ${roomId} not found`);
//        return;
//      }

//      const messages = await this.chatRoomService.getMessagesByChatRoomId(roomId);
//      client.emit('chatRoomMessages', messages);
//    } catch (error) {
//      this.logger.error(`Error fetching chat room messages: ${error.message}`);
//    }
//  }

//  @SubscribeMessage('fetchLastMessage')
//async fetchLastMessage(
//  client: Socket,
//  payload: { roomId: number },
//): Promise<void> {
//  try {
//    const { roomId } = payload;
//    const chatRoom = await this.chatRoomService.getChatRoomById(roomId);

//    if (!chatRoom) {
//      this.logger.warn(`Chat room with ID ${roomId} not found`);
//      return;
//    }

//    const lastMessage = await this.chatRoomService.getLastMessageByChatRoomId(roomId);
//    client.emit(`lastMessage:${roomId}`, lastMessage);
//  } catch (error) {
//    this.logger.error(`Error fetching last message: ${error.message}`);
//  }
//}

//}
