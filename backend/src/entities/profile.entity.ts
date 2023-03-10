import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: "user_profiles"})
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  age: number;
}
