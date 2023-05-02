import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'src/entities/chatroom.entity';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(ChatRoom) private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(User) private userRepository: Repository<User>,) {}

    // This function need a chatroom, a sender and a content.
    // It will create a new message and save it in the database.
    // It will also update the last_message and last_user of the chatroom.
    // It will return the new message.
    async sendToChatRoom(chatRoomId: number, senderId: number, content: string): Promise<Message> {
      const sender = await this.userRepository.findOne({ where: { id: senderId } });
      const chatRoom = await this.chatRoomRepository.findOne({ where: { id: chatRoomId } });
      if (!sender) {
        throw new NotFoundException(`Sender with ID ${senderId} not found.`);
      }
      if (!chatRoom) {
        throw new NotFoundException(`Conversation with ID ${chatRoomId} not found.`);
      }
  
      const newMessage = this.messageRepository.create({
        content: content,
        chatroom: chatRoom,
        user: sender,
      });
  
      if (newMessage) {
        chatRoom.last_message = newMessage;
        chatRoom.last_user = sender;
      }
  
      await this.messageRepository.save(newMessage);
      await this.chatRoomRepository.save(chatRoom);
      return (newMessage);
    }

}


  //async createMessage(roomId: number, senderId: number, content: string): Promise<Message> {
  //  const sender = await this.userRepository.findOne({ where: { id: senderId } });
  //  const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId } });

  //  if (!sender) {
  //    throw new NotFoundException(`Sender with ID ${senderId} not found.`);
  //  }
  
  //  if (!chatRoom) {
  //    throw new NotFoundException(`Conversation with ID ${roomId} not found.`);
  //  }

  //  const newMessage = this.messageRepository.create({
  //    senderId: sender.id,
  //    chatroomId: chatRoom.id,
  //    content: content,
  //  });
  
  //  newMessage.sender = sender;
  //  newMessage.chatroom = chatRoom;

  //  chatRoom.last_message = newMessage;
  //  chatRoom.last_message_id = newMessage.id;
  //  chatRoom.last_user = sender;
  //  chatRoom.last_user_id = sender.id;
  
  //  await this.messageRepository.save(newMessage);
  //  await this.chatRoomRepository.save(chatRoom);
  //  return newMessage;
  //}

  //async deleteMessage(id: string): Promise<void> {
  //  await this.messageRepository.delete(id);
  //}

  //async getMessage(id: number): Promise<Message> {
  //  return await this.messageRepository.findOne({ where: { id } });
  //}

  //async getAllMessages(id: number): Promise<Message[]> {
  //  return await this.messageRepository.find({ where: { senderId: id } });
  //}


