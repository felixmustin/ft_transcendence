import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChatRoom } from './chatroom.entity';
import { Profile } from './profile.entity';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column()
  chatroom_id: number;

  @ManyToOne(() => ChatRoom, (chatroom) => chatroom.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatroom_id' })
  chatroom: ChatRoom;

  @Column()
  profile_id: number;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @CreateDateColumn()
  created_at: Date;
}