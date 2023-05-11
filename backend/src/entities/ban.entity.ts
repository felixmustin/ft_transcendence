import {
    Entity,
    ManyToOne,
    JoinColumn,
    Column,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { ChatRoom } from './chatroom.entity';
  
  @Entity('ban')
  export class Ban {
    @PrimaryGeneratedColumn()
	  id: number;
  
    @Column()
    chatroom_id: number;
  
    @Column()
    user_id: number;
  
    @Column('timestamptz')
    time_banned: Date;
  
    @ManyToOne(() => ChatRoom, (chatroom) => chatroom.banned, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chatroom_id' })
    chatroom: ChatRoom;
  }