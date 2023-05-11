import { Server } from 'socket.io';
import { ScoreProps, GameStateupdate, gameResume } from "./pong.service";
import { PongService } from "./pong.service";
import { Game } from "src/entities/game.entity";
import { Pong } from "./game/Pong";
import { coordonate } from "./game/Pong";
import { Item } from "./game/Item";

export type pose_size = {
	pos: coordonate,
	size: coordonate,
}

export type Game_state = {
	paddleright: pose_size,
	paddleleft: pose_size,
	ball: pose_size[],
	bonus: coordonate | undefined,
	which_bonus: number,
}

export class Room {

	id: string;
	state: Pong;
	intervalid: NodeJS.Timer;
	finished: boolean;
	playpause: boolean;
	server: Server;
	players: number;
	score1: number;
	score2: number;
	idp1: string;
	idp2: string;
	idspect: string[];
	room_complete: Function;
	rematch: string;
	bonus : boolean;
  
	constructor(id: string, server: Server, private readonly PongService : PongService) {
	  this.id = id;
	  this.server = server;
	  this.idspect = [];
	  this.playpause = false;
	  this.finished = false;
	  this.rematch = '';
	  this.players = 0;
	  this.score1 = 0;
	  this.score2 = 0;
	  this.state = new(Pong);
	  this.room_complete = () => {
      }
	  this.bonus = true;
	}

	connect(id: string){
		if (this.players === 0){
			this.players++;
			this.idp1 = id;
		}
		else if (this.players === 1){
			this.players++;
			this.idp2 = id;
			this.room_complete();
		}
		else {
			this.idspect.push(id);
		}
	}

	disconnect(id: string){
		if (id === this.idp1){
			this.end_match();
			this.idp1 = '';
			this.players--;
			this.server.to(this.id).emit('quit');
		}
		else if (id === this.idp2){
			this.end_match();
			this.idp2 = '';
			this.players--;
			this.server.to(this.id).emit('quit');
		}
		else if (this.idspect && this.idspect.includes(id)){
		}
	}

	item_to_pose_size(item: Item): pose_size{
		const pose = {
			x: item.x,
			y: item.y,
		}
		const size = {
			x: item.width,
			y: item.heigth,
		}
		const ret = {
			pos: pose,
			size: size,
		}
		return ret;
	}

	post_score_db(){
		const id1: number = this.PongService.identifiate(this.idp1)?.id;
		const id2: number = this.PongService.identifiate(this.idp2)?.id;
		const game: gameResume = {
			player1_id: id1,
			player2_id: id2,
			player1_score: this.score1,
			player2_score: this.score2,
		}
		this.PongService.saveGame(game);
	}

	end_match(){
			this.finished = true;
			this.post_score_db();
			this.reset_game();
	}
	
	reset_game(){
		this.playpause = false;
		this.finished = false;
		this.state.reset();
		this.score1 = 0;
		this.score2 = 0;
		this.server.to(this.id).emit('updateState', this.gen_game_state());
		const data: ScoreProps = {
			player1 : this.PongService.identifiate(this.idp1)?.username,
			player2 : this.PongService.identifiate(this.idp2)?.username,
			score1 : this.score1,
			score2 : this.score2,
		}
		this.server.to(this.id).emit('score', JSON.stringify(data));
	}

	check_goal(index: number){
		if (this.state.ball[index].x <= 0){
			this.score2++;
			if (this.state.which_bonus === 5)
				this.score2++;
			this.emit_score_reset_ball(index);
		}
		else if (this.state.ball[index].x + this.state.ball[index].width >= this.state.board.width){
			this.score1++;
			if (this.state.which_bonus === 5)
				this.score1++;
			this.emit_score_reset_ball(index);
		}
		if (this.score1 >= 10 || this.score2 >= 10){
			this.finished = true;
		}
	}

	gen_game_state(): Game_state{
		const data : Game_state = { 
			paddleleft: this.item_to_pose_size(this.state.paddleleft),
			paddleright: this.item_to_pose_size(this.state.paddleright), 
			ball: this.state.ball.map(item => this.item_to_pose_size(item)),
			bonus: this.state.bonus ? {x: this.state.bonus.x, y: this.state.bonus.y} : undefined,
			which_bonus: this.state.which_bonus,
		};
		return data;
	}

	update_game_emit(){
		this.state.updategame();
		this.server.to(this.id).emit('updateState', this.gen_game_state())
		for (let i: number = 0; i < this.state.ball.length; i++){
			this.check_goal(i);
		}
	}

	emit_score_reset_ball(index: number){
		if (this.state.ball.length <= 1){
			this.pause();
			this.state.reset();
			this.server.to(this.id).emit('updateState', this.gen_game_state())
		}
		const data: ScoreProps = {
			player1 : this.PongService.identifiate(this.idp1).username,
			player2 : this.PongService.identifiate(this.idp2).username,
			score1 : this.score1,
			score2 : this.score2,
		}
		this.server.to(this.id).emit('score', JSON.stringify(data));
	}

	update_paddle(paddle : coordonate, uid: string){
		if (this.playpause){
			if (uid === this.idp1){
				this.update_left_paddle(paddle);
			}
			else if (uid === this.idp2){
				this.update_right_paddle(paddle);
			}
		}
	}
	update_left_paddle(coor: coordonate){
		this.state.update_left_paddle(coor.x, coor.y);
	}

	update_right_paddle(coor: coordonate){
		this.state.update_right_paddle(coor.x, coor.y);
	}

	play(){
		if (this.playpause === false && this.players == 2 && !this.finished){
			this.playpause = true;
			this.intervalid = setInterval( () => {
				this.update_game_emit()
			}, 50);
		}
	}

	pause(){
		if (this.playpause === true){
			this.playpause = false;
			clearInterval(this.intervalid);
		}
	}
	rematch_handler(id :string){
		if (this.rematch === '' && (id === this.idp1 || id === this.idp2)){
			this.rematch = id;
		}
		else if ((id === this.idp1 && this.rematch === this.idp2) || (id === this.idp2 && this.rematch === this.idp1)){
			this.reset_game();
		}
	}
	setbonus(bonus: boolean){
		this.bonus = bonus;
		if (!bonus){
			this.state.which_bonus = -100;
		}
		else{
			this.state.which_bonus = -1;
		}
	}
  }