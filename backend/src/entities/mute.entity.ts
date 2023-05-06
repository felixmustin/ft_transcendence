import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';
import { ChatRoom } from './chatroom.entity';

@Entity('mute')
export class Mute {
  @PrimaryColumn()
  chatroom_id: number;

  @PrimaryColumn()
  user_id: number;

  @Column('timestamptz')
  time_muted: Date;

  @ManyToOne(() => ChatRoom, (chatroom) => chatroom.muted, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatroom_id' })
  chatroom: ChatRoom;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
