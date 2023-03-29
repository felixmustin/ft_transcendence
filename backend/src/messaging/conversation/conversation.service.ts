// conversation.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from 'src/entities/conversation.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
  ) {}

  async getAllConversationsByUserId(userId: number): Promise<Conversation[]> {
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.messages', 'messages')
      .where('conversation.user1_id = :userId OR conversation.user2_id = :userId', {
        userId,
      })
      .orderBy('messages.createdAt', 'DESC')
      .getMany();
  }

  async getConversationByConvId(convId: number): Promise<Conversation> {
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.id = :conversationId', { convId })
      .getOne();
  }

  async getConversationByUsers(user1Id: number, user2Id: number): Promise<Conversation> {
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('(conversation.user1_id = :user1Id AND conversation.user2_id = :user2Id) OR (conversation.user1_id = :user2Id AND conversation.user2_id = :user1Id)', {
        user1Id,
        user2Id,
      })
      .getOne();
  }


  async createConversation(user1Id: number, user2Id: number): Promise<Conversation> {
    const newConversation = this.conversationRepository.create({
      user1_id: user1Id,
      user2_id: user2Id,
    });
  
    await this.conversationRepository.save(newConversation);
    return newConversation;
  }


  async deleteConversation(conversationId: number): Promise<void> {
    await this.conversationRepository.delete(conversationId);
  }

  async deleteAllConversations(userId: number): Promise<void> {
    await this.conversationRepository.delete({
      user1_id: userId,
    });
    await this.conversationRepository.delete({
      user2_id: userId,
    });
  }

}
