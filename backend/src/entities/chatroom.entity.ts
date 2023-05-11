import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    OneToMany,
    ManyToOne,
    JoinColumn,
    JoinTable,
  } from 'typeorm';
import { Message } from './message.entity';
import { Profile } from './profile.entity';
import { Mute } from './mute.entity';
import { Ban } from './ban.entity';

export enum ChatRoomMode {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PRIVATE = 'private',
}

@Entity('chatroom')
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'bytea' })
  image: Buffer;

  @Column({ type: 'integer', array: true, default: [] })
  admins: number[];

  @ManyToMany(() => Profile, (profile) => profile.chatrooms)
  @JoinTable({
    name: 'chatroom_participants',
    joinColumn: { name: 'chatroom_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'profile_id', referencedColumnName: 'id' },
  })
  participants: Profile[];

  @Column({ type: 'enum', enum: ChatRoomMode, default: ChatRoomMode.PRIVATE })
  mode: ChatRoomMode;

  @Column({ nullable: true })
  password_hash: string;

  @Column({ })
  owner_id: number;

  @Column({ nullable: true })
  last_message_id: number;

  @ManyToOne(() => Message)
  @JoinColumn({ name: 'last_message_id' })
  last_message: Message;

  @Column({ nullable: true })
  last_profile_id: number;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'last_profile_id' })
  last_profile: Profile;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

    @OneToMany(() => Message, (message) => message.chatroom, {onDelete: 'CASCADE'})
    messages: Message[];

    @OneToMany(() => Mute, (mute) => mute.chatroom, { onDelete: 'CASCADE' })
    muted: Mute[];

    @OneToMany(() => Ban, (ban) => ban.chatroom, { onDelete: 'CASCADE' })
    banned: Ban[];


    // @ManyToMany(() => User)
    // @JoinTable({
    //   name: 'chatroom_blocked_users',
    //   joinColumn: { name: 'chatroom_id', referencedColumnName: 'id' },
    //   inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    // })
    // blocked: User[];
  }