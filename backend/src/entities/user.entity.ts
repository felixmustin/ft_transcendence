import { Profile } from 'src/entities/profile.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity({name: "users"})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  wordpass: string;

  @Column()
  secret2fa: string;

  @Column({ default: false })
  is2faenabled: boolean;

  @Column({ unique: true })
  user42id: number;

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn({ name: 'profileid' })
  profile: Profile;

}
