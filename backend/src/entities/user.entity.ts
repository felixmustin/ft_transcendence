import { Profile } from 'src/entities/profile.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true})
  loginName: string;

  @Column({ nullable: true })
  wordpass: string;

  @Column({nullable: true})
  secret2fa: string;

  @Column({ default: false })
  is2faenabled: boolean;

  @Column({ unique: true, nullable: true })
  user42id: number;

  @Column({ unique: true, nullable: true })
  refreshtoken: string;

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn({ name: 'profileid' })
  profile: Profile;

  @Column({ type: 'integer', array: true, default: '{}' })
  blocked: number[];
}

