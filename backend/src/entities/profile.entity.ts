import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
// import { Avatar } from './avatar.entity';

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

  @Column({ type: 'bytea' })
  avatar: Buffer;
}
