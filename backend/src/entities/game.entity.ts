// game.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Profile } from './profile.entity';

@Entity({ name: 'game' })
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Profile, (profile) => profile.games)
  players: Profile[];

  @Column({ name: 'score1' })
  score1: number;

  @Column({ name: 'score2' })
  score2: number;
}