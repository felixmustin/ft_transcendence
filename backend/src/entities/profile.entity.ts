import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
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

  @ManyToMany(() => Game)
  @JoinTable({
    name: 'user_profiles_games',
    joinColumn: { name: 'user_profile_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'game_id', referencedColumnName: 'id' },
  })
  games: Game[];

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