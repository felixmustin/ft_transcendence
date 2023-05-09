import React, { useState, useEffect, Component } from 'react';
import './pong.css';
import { Socket } from 'socket.io-client';
import { Left_Paddle, Right_Paddle } from './assets/paddle';
import { Balls } from './assets/balls';
import GameboardIcon from './assets/bonus';

export type pose_size = {
	pos: coordonate,
	size: coordonate,
}


class Game_Board extends Component<GameState> {
  	render(){ 
	const { paddleleft, paddleright, ball, bonus, which_bonus } = this.props;
	return (
	<div className="game-board">
		<Left_Paddle pos={paddleleft.pos} size={paddleleft.size} />
        <Right_Paddle pos={paddleright.pos} size={paddleright.size} />
        <Balls balls={ball} which_bonus={which_bonus}/>
		<GameboardIcon bonus={bonus} which_bonus={which_bonus} />
	</div>
  );}
}

export type ScoreProps = {
	player1: string,
	player2: string,
	score1: number,
	score2: number,
}

class Score_Container extends React.Component <ScoreProps>{
	render (){
		const {player1, player2, score1, score2} = this.props;
		return (
			<div className="score-container">
					<div style={{ display: 'flex', justifyContent: 'center', whiteSpace: 'pre-line' }}>
						<p style={{ textAlign: 'center' }}>{player1 + " " + " vs " + player2 + "\n\r" + score1 + "|" + score2}</p>
					</div>
				</div>
		);
	}
}

export type GamePongProps = {
	roomID: string,
	score: ScoreProps,
	uid: string,
	player: number,
	socket: Socket,
  };

type GameState = {
	paddleright: pose_size,
	paddleleft: pose_size,
	ball: pose_size[],
	bonus: coordonate | undefined,
	which_bonus: number,
  };

export type coordonate = {
	x: number,
	y: number,
}
type PaddleMove = {
	paddle: coordonate,
	roomID: string,
	uid: string,
}

type playpause = {
	roomID: string,
	uid:string,
	play: boolean,
}

class GamePong extends React.Component<GamePongProps, GameState> {
	private score: ScoreProps;
	private keysPressed: Set<string> = new Set<string>();
	private moveIntervalId: any;

	constructor (props: any){
		super(props);
		const paddlesize: coordonate = {
			x: 20,
			y: 80,
		}
		this.state = {
			paddleleft: {pos:{x: 20, y: 160}, size: paddlesize},
  			paddleright: {pos:{x: 560, y: 160}, size: paddlesize},
  			ball: [{pos:{x: 300, y: 200}, size:{x: 20, y: 20}}],
			bonus: undefined,
			which_bonus: -1,
		};
		this.score = this.props.score;
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}
	componentDidMount(): void {
		document.addEventListener("keydown", this.handleKeyDown);
		document.addEventListener("keyup", this.handleKeyUp);
    	this.props.socket.on('updateState', (data: GameState) => {
    		this.setState(data);
    	});
		this.props.socket.on('score', (data: string) => {
			const score: ScoreProps = JSON.parse(data);
			this.score = score;
		});
		this.moveIntervalId = setInterval(() => {
			if (this.keysPressed.size === 0) return; // nothing to do
			let dx = 0, dy = 0;
			if (this.keysPressed.has("w")) dy -= 10;
			if (this.keysPressed.has("s")) dy += 10;
			if (this.keysPressed.has("a")) dx -= 10;
			if (this.keysPressed.has("d")) dx += 10;
			if (dx === 0 && dy === 0) return; // nothing to do
			const data: PaddleMove = {
			  paddle: { x: dx, y: dy },
			  roomID: this.props.roomID,
			  uid: this.props.uid,
			};
			this.props.socket.emit("updatePaddle", data);
		  }, 50);
	}
	componentWillUnmount(): void {
		document.removeEventListener("keydown", this.handleKeyDown);
		document.removeEventListener("keyup", this.handleKeyUp);
		clearInterval(this.moveIntervalId);
	}
	handleKeyDown = (event: KeyboardEvent) => {
		event.preventDefault();
		this.keysPressed.add(event.key);
		if (this.keysPressed.has("c")) { // C
			const data: playpause = {
				roomID : this.props.roomID,
				uid : this.props.uid,
				play: true,
			};
			this.props.socket.emit('playPong', data);
		}
		if (this.keysPressed.has("v")) { // V
			const data: playpause = {
				roomID : this.props.roomID,
				uid : this.props.uid,
				play: false,
			};
			this.props.socket.emit('stopPong', data);
		}
	  };
	  handleKeyUp = (event: KeyboardEvent) => {
		this.keysPressed.delete(event.key);
	  };
	  rematch_handler = () => {
		this.props.socket.emit('rematch', this.props.roomID);
	  };
	  quit_handler = () => {
		this.props.socket.emit('quit');
	  };
	render () {
		return (
		<div>
			<div className="status-container">
				<Score_Container {...this.score} />
					<div className="game-board-container">
						<div className="game-board">
							<Game_Board {...this.state}/>
						</div>
					</div>
					<div>press 'c' to play or 'v' to pause<br />press 'w' to go up and 's' to go down<br />press'a' to go left and 'd' to go right</div>
			</div>
			{(this.score.score1 >= 10 || this.score.score2 >= 10) && (
			<>
				<button onClick={this.rematch_handler}>Restart Game</button>
				<button onClick={this.quit_handler}>End Game</button>
			</>
		)}
		</div>
		);
	}
}

export default GamePong;