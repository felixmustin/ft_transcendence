import { GameState } from "./GameState";
import { Server } from 'socket.io';
import { ScoreProps, GameStateupdate } from "./pong.service";

export class Room {
	id: string;
	state: GameState;
	intervalid: NodeJS.Timer;
	finished: boolean;
	playpause: boolean;
	server: Server;
	players: number;
	score1: number;
	score2: number;
	idp1: string;
	idp2: string;
	room_complete: Function;
  
	constructor(id: string, server: Server) {
	  this.id = id;
	  this.server = server;
	  this.playpause = false;
	  this.finished = false;
	  this.players = 0;
	  this.score1 = 0;
	  this.score2 = 0;
	  this.state = new(GameState);
	}

	connect(id: string){
		this.players++;
		if (this.players === 1){
			this.idp1 = id;
		}
		else if (this.players === 2){
			this.idp2 = id;
			this.room_complete();
		}
		else {
			console.log('error connect room');
		}
	}

	disconnect(id: string){
		if (id == this.idp1){
			this.idp1 = '';
			this.players--;
		}
		else if (id == this.idp2){
			this.idp2 = '';
			this.players--;
		}
		else {
			console.log('error room disconnect');
		}
	}
	
	reset_game(){
		this.playpause = false;
		this.finished = false;
		this.state.reset();
		this.score1 = 0;
		this.score2 = 0;
	}

	update_game_emit(){
		this.state.updategame();
		const data : GameStateupdate = { 
			leftPaddleY: this.state.paddleleftposition,
			rightPaddleY: this.state.paddlerightposition, 
			ballPosition: {x: this.state.ballpositionx, y: this.state.ballpositiony},
			nextballPosition: {x: this.state.nextballpositionx, y: this.state.nextballpositiony},
			play : true,
		};
		this.server.to(this.id).emit('updateState', JSON.stringify(data))
		if (this.state.ballpositionx < 0){
			this.score2++;
			this.emit_score_reset_ball();
		}
		else if (this.state.ballpositionx > 590){
			this.score1++;
			this.emit_score_reset_ball();
		}
	}

	emit_score_reset_ball(){
		this.state.nextballpositionx = 300;
		this.state.nextballpositiony = 200;
		const data: ScoreProps = {
			player1 : 'player1',
			player2 : 'player2',
			score1 : this.score1,
			score2 : this.score2,
		}
		this.server.to(this.id).emit('score', JSON.stringify(data));
	}

	update_paddle(paddle : number, uid: string){
		console.log('update paddle uid : ' + uid + ' | ' + this.idp1 + ' | ' + this.idp2);
		if (uid === this.idp1){
			this.update_left_paddle(paddle);
		}
		else if (uid === this.idp2){
			this.update_right_paddle(paddle);
		}
	}
	update_left_paddle(leftPaddleY: number){
		this.state.update_left_paddle(leftPaddleY);
	}

	update_right_paddle(rightPaddleY: number){
		this.state.update_right_paddle(rightPaddleY);
	}

	play(){
		if (this.playpause === false && this.players == 2){
			this.playpause = true;
			this.intervalid = setInterval( () => {
				this.update_game_emit()
			}, 100);
		}
	}

	pause(){
		if (this.playpause === true){
			this.playpause = false;
			clearInterval(this.intervalid);
		}
	}
  }