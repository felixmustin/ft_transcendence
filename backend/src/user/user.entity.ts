import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: "users"})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  username: string;

  @Column()
  wordpass: string;
}
