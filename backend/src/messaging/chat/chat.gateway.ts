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
