import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Game } from './game.entity';
import { ChatRoom } from './chatroom.entity';
import { Message } from './message.entity';

@Entity({ name: "user_profiles" })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  age: number;

  @ManyToMany(() => Game)
  @JoinTable({
    name: 'user_profiles_games',
    joinColumn: { name: 'user_profile_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'game_id', referencedColumnName: 'id' },
  })
  games: Game[];

  @Column({ type: 'bytea' })
  avatar: Buffer;

  @ManyToMany(() => ChatRoom, (chatroom) => chatroom.participants)
  chatrooms: ChatRoom[];

  @OneToMany(() => Message, (message) => message.profile)
  messages: Message[];

  @Column({ default: 0 })
  gamesWon: number;

  @Column({ default: 0 })
  statusid: number;
}
