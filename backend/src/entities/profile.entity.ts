// profile.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Game } from './game.entity';

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

  @Column({ type: 'bytea' })
  avatar: Buffer;

  @ManyToMany(() => Game, (game) => game.players)
  @JoinTable({
    name: 'profile_games',
    joinColumn: { name: 'profile_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'game_id', referencedColumnName: 'id' },
  })
  games: Game[];
}