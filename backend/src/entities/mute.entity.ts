import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatRoom } from './chatroom.entity';
import { Profile } from './profile.entity';

@Entity('mute')
export class Mute {
  @PrimaryGeneratedColumn()
	id: number;
  
  @Column()
  chatroom_id: number;

  @Column()
  user_id: number;

  @Column('timestamptz')
  time_muted: Date;

  @ManyToOne(() => ChatRoom, (chatroom) => chatroom.muted, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatroom_id' })
  chatroom: ChatRoom;

  // @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'user_id' })
  // user: Profile;
}
