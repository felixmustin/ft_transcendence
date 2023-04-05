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
  import { User } from './user.entity';
  import { Message } from './message.entity';

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

    @Column({ nullable: true })
    image: string;

    @ManyToMany(() => User, (user) => user.chatrooms)
    @JoinTable({
      name: 'chatroom_participants',
      joinColumn: { name: 'chatroom_id', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    participants: User[];

    @Column({ type: 'enum', enum: ChatRoomMode, default: ChatRoomMode.PRIVATE })
    mode: ChatRoomMode;

    @Column({ nullable: true })
    password_hash: string;

    @Column({ nullable: true })
    last_message_id: number;

    @ManyToOne(() => Message)
    @JoinColumn({ name: 'last_message_id' })
    last_message: Message;

    @Column({ nullable: true })
    last_user_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'last_user_id' })
    last_user: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Message, (message) => message.chatroom)
    messages: Message[];
  }