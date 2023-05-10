import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom, ChatRoomMode } from '../../entities/chatroom.entity';
import { User } from '../../entities/user.entity';
import { Message } from '../../entities/message.entity';
import { Profile } from 'src/entities/profile.entity';
import { MessageService } from '../message/message.service';
import { UserService } from 'src/user/user.service';
import { readFileSync } from 'fs';
import { Mute } from 'src/entities/mute.entity';
import { Ban } from 'src/entities/ban.entity';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Mute)
    private muteRepository: Repository<Mute>,
    @InjectRepository(Ban)
    private banRepository: Repository<Ban>,
	private messageService: MessageService,
  private userService: UserService,
  ) {}


  async createChatRoomFromUsers(userId: number, targetId: number): Promise<ChatRoom> {
    let chatRoom = await this.getChatRoomByUsers(userId, targetId);
    if (!chatRoom) {
      // Fetch the User entities using the provided IDs
      const user1 = await this.userRepository.findOne({ where: { id: userId }, relations: ['profile'] });
      const user2 = await this.userRepository.findOne({ where: { id: targetId }, relations: ['profile'] });

      if (!user1 || !user2) {
        throw new Error('One or both users not found');
      }

      const img = readFileSync("./assets/login.jpg");
      // Create a new ChatRoom entity with the fetched users as participants
      const chatRoom = this.chatRoomRepository.create({
        image: img,
        participants: [user1.profile, user2.profile],
        admins: [user1.id, user2.id],
      });
      await this.chatRoomRepository.save(chatRoom);
    }
    return chatRoom;
  }

  async createCustomChatRoom(name: string, mode: string, password: string, userId: number): Promise<ChatRoom> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['profile'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (!Object.values(ChatRoomMode).includes(mode as ChatRoomMode)) {
      throw new NotFoundException('Invalid chat room mode');
    }
  
    if (!name)
      name = user.profile.username + "'s group"
    const img = readFileSync("./assets/login.jpg");

    const chatRoom = this.chatRoomRepository.create({
      image: img,
      name: name,
      mode: mode as ChatRoomMode,
      password_hash: (mode === ChatRoomMode.PROTECTED) ? password : null,
      participants: [user.profile],
      admins: [user.id],
    });
    await this.chatRoomRepository.save(chatRoom);
    return chatRoom;
  }

  async joinChatRoom(roomId: number, password: string, userId: number) {
    const chatRoom = await this.getChatRoomById(roomId)
    const userToAdd = await this.userService.findUserProfileById(userId)

    if (chatRoom.mode == 'public') {
        chatRoom.participants.push(userToAdd);
        await this.updateChatRoom(chatRoom);
      }   
    
    else if (chatRoom.mode == 'protected') {
      if (password == chatRoom.password_hash) {
        chatRoom.participants.push(userToAdd);
        await this.updateChatRoom(chatRoom);
      }
      else
        throw new UnauthorizedException('Wrong password');
    }

  }

  async addMemberToChatRoom(roomId: number, username: string, userId: number) {
    const chatRoom = await this.getChatRoomById(roomId)
    const isAdmin = chatRoom.admins.find(id => id === userId) !== undefined;   

    if (!isAdmin)
      throw new UnauthorizedException('You are not an admin of this group chat');
    else {
      const userToAdd = await this.userService.findUserProfileByUsername(username)
    if (!userToAdd) {
      throw new Error(`User with username ${username} does not exist`);
    }
      if (!chatRoom.participants.find(participant => participant.id === userToAdd.id)) {
        chatRoom.participants.push(userToAdd);
        await this.updateChatRoom(chatRoom);
      }    
    }
  }

  async removeMemberFromChatRoom(roomId: number, username: string, userId: number) {
    const chatRoom = await this.getChatRoomById(roomId)
    const isAdmin = chatRoom.admins.find(id => id === userId) !== undefined;   

    if (!isAdmin)
      throw new UnauthorizedException('You are not an admin of this group chat');
    else {
      const userToRemove = await this.userService.findUserProfileByUsername(username)
      const you = await this.userService.findUserProfileById(userId)
      if (username == you.username)
        throw new UnauthorizedException('Cannot remove yousrelf of this group chat');
    if (!userToRemove) {
      throw new Error(`User with username ${username} does not exist`);
    }
      if (chatRoom.participants.find(participant => participant.id === userToRemove.id)) {
        chatRoom.participants = chatRoom.participants.filter((participant) => participant.id !== userToRemove.id);
        await this.updateChatRoom(chatRoom);
      }    
    }
  }

  async addAdminToChatRoom(roomId: number, username: string, userId: number) {
    const chatRoom = await this.getChatRoomById(roomId)
    const isAdmin = chatRoom.admins.find(id => id === userId) !== undefined;   

    if (!isAdmin)
      throw new UnauthorizedException('You are not an admin of this group chat');
    else {
      const userToAdd = await this.userService.findUserByUsername(username)
    if (!userToAdd) {
      throw new Error(`User with username ${username} does not exist`);
    }
    if (chatRoom.admins.includes(userToAdd.id)) {
      throw new Error(`User with username ${username} is already an admin in this chat room`);
    }
      if (chatRoom.participants.find(participant => participant.id === userToAdd.id)) {
        chatRoom.admins.push(userToAdd.id);
        await this.updateChatRoom(chatRoom);
      }
    }
  }

  async removeAdminFromChatRoom(roomId: number, username: string, userId: number) {
    const chatRoom = await this.getChatRoomById(roomId)
    const isAdmin = chatRoom.admins.find(id => id === userId) !== undefined;   

    if (!isAdmin)
      throw new UnauthorizedException('You are not an admin of this group chat');
    else {
      const userToRemove = await this.userService.findUserByUsername(username)
    if (!userToRemove) {
      throw new Error(`User with username ${username} does not exist`);
    }
    if (!chatRoom.admins.includes(userToRemove.id)) {
      throw new Error(`User with username ${username} is not an admin in this chat room`);
    }
    chatRoom.admins = chatRoom.admins.filter((id) => id !== userToRemove.id);
    await this.updateChatRoom(chatRoom);
    }
  }

  async banOrMuteUserFromChatRoom(roomId: number, username: string, userId: number, duration: string, banOrMute: boolean) {
    const chatRoom = await this.getChatRoomById(roomId)
    const isAdmin = chatRoom.admins.find(id => id === userId) !== undefined;   

    if (!isAdmin)
      throw new UnauthorizedException('You are not an admin of this group chat');
    else {
      const userProfileTo = await this.userService.findUserProfileByUsername(username)
      if (!userProfileTo)
        throw new Error(`User with username ${username} does not exist`);

      const isToAdmin = chatRoom.admins.find(id => id === userProfileTo.id) !== undefined;   
      if (isToAdmin)
        throw new UnauthorizedException('Cannot mute or ban an admin');

      if (chatRoom.participants.find(participant => participant.id === userProfileTo.id)) {
        if (banOrMute) {

          const mute = new Mute();
          mute.chatroom_id = roomId;
          mute.chatroom = chatRoom;
          mute.user_id = userProfileTo.id;
          mute.time_muted = new Date(Date.now() +  (Number(duration)*1000) );
          chatRoom.muted.push(mute);
          await this.muteRepository.save(mute);
        }
        else {
          const ban = new Ban();
          ban.chatroom_id = roomId;
          ban.chatroom = chatRoom;
          ban.user_id = userProfileTo.id;
          ban.time_banned = new Date(Date.now() +  (Number(duration)*1000) );
          chatRoom.banned.push(ban);
          await this.banRepository.save(ban);
        }
        await this.updateChatRoom(chatRoom);
      }
    }
  }

  async isUserMutedFromChatRoom(userId: number, roomId: number) {
    const chatRoom = await this.getChatRoomById(roomId)
    const userProfile = await this.userService.findUserProfileById(userId)

   for (let i=0; i < chatRoom.muted.length; i++) {
    if (chatRoom.muted[i].user_id == userProfile.id) {

      if (chatRoom.muted[i].time_muted > (new Date(Date.now())))
        return true;
    }
   }
   return false
  }

  async isUserBannedFromChatRoom(userId: number, roomId: number) {
    const chatRoom = await this.getChatRoomById(roomId)
    const userProfile = await this.userService.findUserProfileByProfileId(userId)

   for (let i=0; i < chatRoom.banned.length; i++) {
    if (chatRoom.banned[i].user_id == userProfile.id) {
      if (chatRoom.banned[i].time_banned > (new Date(Date.now())))
        return true;
    }
   }
   return false
  }


  async updateImageChatRoom(userId: number, file: Buffer, roomId: number) {
    const chatRoom = await this.getChatRoomById(roomId)
    const isAdmin = chatRoom.admins.find(id => id === userId) !== undefined; 

    if (!isAdmin)
      throw new UnauthorizedException('You are not an admin of this group chat');
    else {
      chatRoom.image = file;
      return await this.updateChatRoom(chatRoom);
    }
  }

  async updateNameChatRoom(userId:number, roomId:number, roomName:string) {
    const chatRoom = await this.getChatRoomById(roomId)
    const isAdmin = chatRoom.admins.find(id => id === userId) !== undefined;   

    if (!isAdmin)
      throw new UnauthorizedException('You are not an admin of this group chat');
    else {
      chatRoom.name = roomName;
      return await this.updateChatRoom(chatRoom);
    }
  }

  async updateModeChatRoom(userId:number, roomId:number, roomMode:string, roomPassword:string) {
    const chatRoom = await this.getChatRoomById(roomId)
    const isAdmin = chatRoom.admins.find(id => id === userId) !== undefined;   

    if (!isAdmin)
      throw new UnauthorizedException('You are not an admin of this group chat');
    else {
      chatRoom.mode = roomMode as ChatRoomMode;
      chatRoom.password_hash = (chatRoom.mode === ChatRoomMode.PROTECTED) ? roomPassword : null;
    }
    return await this.updateChatRoom(chatRoom);
  }

  async getUsernameAdminList(roomId: number) {
    const chatRoom = await this.getChatRoomById(roomId)
    const adminIds = chatRoom.admins;
    const adminProfiles = chatRoom.participants.filter(profile => adminIds.includes(profile.id));
    const adminUsernames = adminProfiles.map(profile => profile.username);
    return adminUsernames;
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
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['profile'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const name = user.profile.username + "'s group"
    const img = readFileSync("./assets/login.jpg");
    const chatRoom = this.chatRoomRepository.create({
      participants: [user.profile],
      name: name,
      image: img,
      admins: [user.id],
    });
    await this.chatRoomRepository.save(chatRoom);
    return chatRoom;
  }

  async getAllChatRooms(): Promise<ChatRoom[]> {
    const chatRooms = await this.chatRoomRepository.find();
    return chatRooms;
  }

  async getChatRoomById(roomId: number): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId }, relations: ['messages', 'participants', 'muted', 'banned'] });
    return chatRoom;
  }

  async getAllChatRoomsByUserId(userId: number): Promise<ChatRoom[]> {
    // First, check if the user exists
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['profile'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Find all chatrooms where the user is present
    const chatRooms = await this.chatRoomRepository.createQueryBuilder('chatroom')
    .leftJoinAndSelect('chatroom.participants', 'participants')
    .innerJoin('chatroom.participants', 'user', 'user.id = :userId', { userId: user.profile.id })
    .getMany();
  
    return chatRooms;
  }

  async getMessagesByChatRoomId(roomId: number): Promise<Message[]> {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId }, relations: ['messages'] });
  
    if (!chatRoom) {
      return [];//throw new NotFoundException(`Chatroom with ID ${roomId} not found.`);
    }
	let messages = [];
	for (let i = 0; i < chatRoom.messages.length; i++) {
		messages.push(await this.messageService.getMessageById(chatRoom.messages[i].id));
	}
	return messages;
  }

  async deleteChatRoomById(roomId: number, userId:number): Promise<void> {

    let chatRoom = await this.getChatRoomById(roomId);
    if (!chatRoom) 
      throw new NotFoundException('Chatroom not found');
    const isAdmin = chatRoom.admins.find(id => id === userId) !== undefined;   
    if (!isAdmin)
      throw new UnauthorizedException('You are not an admin of this group chat');
    chatRoom.last_message = null;
    chatRoom.last_profile = null;
    chatRoom.last_message_id = null;
    chatRoom.last_profile_id = null;
    await this.updateChatRoom(chatRoom);
    let messages = await this.getMessagesByChatRoomId(roomId);
    for (let i = 0; i < messages.length; i++) {
      messages[i].chatroom = null;
      await this.messageService.deleteMessageById(messages[i].id);
    }
    chatRoom.messages = [];
    await this.chatRoomRepository.remove(chatRoom);
  }

  async getLastMessageByChatRoomId(roomId: number): Promise<Message> {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId }, relations: ['messages'] });
    if (!chatRoom) {
      throw new NotFoundException('Chatroom not found');
    }
    return chatRoom.messages[chatRoom.messages.length - 1];
  }

  async getProfilesByChatRoomId(roomId: number): Promise<number[]> {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId }, relations: ['participants'] });
    if (!chatRoom) {
      throw new NotFoundException('Chatroom not found');
    }
    return chatRoom.participants.map((profile) => profile.id);
  }

  async getFullProfilesByChatRoomId(roomId: number): Promise<Profile[]> {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId }, relations: ['participants'] });
    if (!chatRoom) {
      throw new NotFoundException('Chatroom not found');
    }
    return chatRoom.participants.map((profile) => profile);
  }

 

  async updateChatRoom(chatRoom: ChatRoom): Promise<ChatRoom> {
    return await this.chatRoomRepository.save(chatRoom);
  }
}