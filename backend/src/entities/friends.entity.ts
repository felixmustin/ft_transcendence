import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'friends' })
export class Friends {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ name: 'from_user_id' })
  fromUserId: number;

  @Column({ name: 'to_user_id' })
  toUserId: number

  @Column({ name: 'request_date' })
  requestDate: Date;

  @Column({ default: false })
  accepted: boolean;

}