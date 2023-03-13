import { Profile } from 'src/entities/profile.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity({name: "users"})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  wordpass: string;

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn({ name: 'profileid' })
  profile: Profile;
}
