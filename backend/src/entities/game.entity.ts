import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity('game')
  export class Game {
	@PrimaryGeneratedColumn()
	id: number;
  
	@Column()
	player1_id: number;
  
	@Column()
	player2_id: number;
  
	@Column()
	player1_score: number;
  
	@Column()
	player2_score: number;
  }
  
