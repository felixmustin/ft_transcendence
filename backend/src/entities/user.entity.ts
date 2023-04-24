import { Profile } from 'src/entities/profile.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ChatRoom } from './chatroom.entity';
import { Message } from './message.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true})
  loginName: string;

  @Column({ nullable: true })
  wordpass: string;

  @Column({nullable: true})
  secret2fa: string;

  @Column({ default: false })
  is2faenabled: boolean;

  @Column({ unique: true, nullable: true })
  user42id: number;

  @Column({ default: 0 })
  statusid: number;

  @Column({ unique: true, nullable: true })
  refreshtoken: string;

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn({ name: 'profileid' })
  profile: Profile;

  @ManyToMany(() => ChatRoom, (chatroom) => chatroom.participants)
  chatrooms: ChatRoom[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}

