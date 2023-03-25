import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from 'src/entities/conversation.entity';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Conversation) private conversationRepository: Repository<Conversation>,
    @InjectRepository(User) private userRepository: Repository<User>,) {}

  async createMessage(convId: number, senderId: number, content: string): Promise<Message> {
    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    const conversation = await this.conversationRepository.findOne({ where: { id: convId } });

    if (!sender) {
      throw new NotFoundException(`Sender with ID ${senderId} not found.`);
    }
  
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${convId} not found.`);
    }

    const newMessage = this.messageRepository.create({
      senderId: sender.id,
      conversationId: conversation.id,
      content: content,
    });
  
    newMessage.sender = sender;
    newMessage.conversation = conversation;
  
    await this.messageRepository.save(newMessage);
    return newMessage;
  }

  async deleteMessage(id: string): Promise<void> {
    await this.messageRepository.delete(id);
  }

  async getMessage(id: number): Promise<Message> {
    return await this.messageRepository.findOne({ where: { id } });
  }

  async getAllMessages(id: number): Promise<Message[]> {
    return await this.messageRepository.find({ where: { senderId: id } });
  }

}
