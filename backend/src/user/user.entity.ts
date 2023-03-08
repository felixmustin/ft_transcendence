import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: "users"})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  wordpass: string;
}
