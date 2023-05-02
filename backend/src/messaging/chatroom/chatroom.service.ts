import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from '../../entities/chatroom.entity';
import { User } from '../../entities/user.entity';
import { Message } from '../../entities/message.entity';
import { Profile } from 'src/entities/profile.entity';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}


  async createChatRoomFromUsers(userId: number, targetId: number): Promise<ChatRoom> {
    let chatRoom = await this.getChatRoomByUsers(userId, targetId);
    if (!chatRoom) {
      // Fetch the User entities using the provided IDs
      const user1 = await this.userRepository.findOne({ where: { id: userId } });
      const user2 = await this.userRepository.findOne({ where: { id: targetId } });

      if (!user1 || !user2) {
        throw new Error('One or both users not found');
      }

      // Create a new ChatRoom entity with the fetched users as participants
      const chatRoom = this.chatRoomRepository.create({
        participants: [user1, user2],
      });
      await this.chatRoomRepository.save(chatRoom);
    }
    return chatRoom;
  }

  // This function looks for a chatroom that has the two users as participants and only those 2
  async getChatRoomByUsers(userId: number, targetId: number): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomRepository
    .createQueryBuilder('chatroom')
    .innerJoin('chatroom.participants', 'participants')
    .where('participants.id IN (:...userIds)', { userIds: [userId, targetId] })
    .groupBy('chatroom.id')
    .having('COUNT(chatroom.id) = 2')
    .getOne();

    return chatRoom;
  }

  async createGroupChatRoom(userId: number): Promise<ChatRoom> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const chatRoom = this.chatRoomRepository.create({
      participants: [user],
    });
    await this.chatRoomRepository.save(chatRoom);
    return chatRoom;
  }

  async getAllChatRooms(): Promise<ChatRoom[]> {
    const chatRooms = await this.chatRoomRepository.find();
    return chatRooms;
  }

  async getChatRoomById(roomId: number): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId }, relations: ['messages'] });
    return chatRoom;
  }

  async getAllChatRoomsByUserId(userId: number): Promise<ChatRoom[]> {
    // First, check if the user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Find all chatrooms where the user is present
    const chatRooms = await this.chatRoomRepository.createQueryBuilder('chatroom')
    .innerJoin('chatroom.participants', 'user', 'user.id = :userId', { userId: userId })
    .getMany();
  
    return chatRooms;
  }

  async getMessagesByChatRoomId(roomId: number): Promise<Message[]> {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId }, relations: ['messages'] });
  
    if (!chatRoom) {
      return [];//throw new NotFoundException(`Chatroom with ID ${roomId} not found.`);
    }
  
    return chatRoom.messages;
  }

  async deleteChatRoomById(roomId: number): Promise<void> {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId } });
    if (!chatRoom) {
      throw new NotFoundException('Chatroom not found');
    }
    await this.chatRoomRepository.remove(chatRoom);
  }

  async getLastMessageByChatRoomId(roomId: number): Promise<Message> {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId }, relations: ['messages'] });
    if (!chatRoom) {
      throw new NotFoundException('Chatroom not found');
    }
    return chatRoom.messages[chatRoom.messages.length - 1];
  }

  async getUsersByChatRoomId(roomId: number): Promise<number[]> {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId }, relations: ['participants'] });
    if (!chatRoom) {
      throw new NotFoundException('Chatroom not found');
    }
    return chatRoom.participants.map((user) => user.id);
  }
}