import React, { useState, useEffect, Component } from 'react';
import './pong.css';
// import io, {Socket} from 'socket.io-client';
import { Socket } from 'socket.io-client';

type ballPosition = {
	x: number,
	y: number,
}
type paddleProps = {
	PaddleY : number,
}
class Right_Paddle extends Component<paddleProps> {
	render(){
		const {PaddleY} = this.props;
		return (
			<div className="paddle" id="right-paddle" style={{ top: PaddleY }} />
		);
	}
}

class Left_Paddle extends Component<paddleProps> {
	render() {
		const {PaddleY} = this.props;
		return (
			<div className="paddle" id="left-paddle" style={{ top: PaddleY }} />
		);
	}
}

type ballProps = {
	ballPosition: ballPosition,
	nextballPosition: ballPosition,
}
class Ball extends Component <ballProps> {
	render() {
		const {ballPosition, nextballPosition} = this.props;
		return (
			<div className='ball' style={{ 
				position: 'absolute',
				top: ballPosition.y,
				left: ballPosition.x,
				width: '20px',
				height: '20px',
				backgroundColor: 'rgba(255, 255, 0, 0.775)',
				borderRadius: '50%',
				transitionProperty: "top, left",
				transitionDuration: "0.1s",
				transitionTimingFunction: "linear",
				...{top: nextballPosition.y, left: nextballPosition.x},
			  }} />
		);
	}
}

type Game_BoardProps = {
	leftPaddleY: number, 
	rightPaddleY: number, 
	ballPosition: ballPosition, 
	nextballPosition: ballPosition,
}
class Game_Board extends Component<Game_BoardProps> {
  	render(){ 
	const { leftPaddleY, rightPaddleY, ballPosition, nextballPosition } = this.props;
	return (
	<div className="game-board">
		<Left_Paddle PaddleY={leftPaddleY} />
        <Right_Paddle PaddleY={rightPaddleY} />
        <Ball ballPosition={ballPosition} nextballPosition={nextballPosition} />
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
	leftPaddleY: number,
	rightPaddleY: number,
	ballPosition: ballPosition,
	nextballPosition: ballPosition,
	play: boolean,
  };

type PaddleMove = {
	paddleY: number,
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

	constructor (props: any){
		super(props);
		this.state = {
			leftPaddleY: 160,
  			rightPaddleY: 160,
  			ballPosition: {x: 290, y: 190},
  			nextballPosition: {x: 300, y: 200},
			play: false,
		};
		this.score = this.props.score;
		console.log('hello from constructor');
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}
	componentDidMount(): void {
		// this.socket = io("http://127.0.0.1:3001");
		console.log('hello from component did mount my uid id ' + this.props.uid);
		// this.socket.on('room', (data: string) => {
    	// 	const room = JSON.parse(data);
		// 	console.log('received room ' + room.roomId + " | " + room.player);
    		// this.setState({
			// 	roomId: room.roomId,
			// 	player: room.player,
			//   }, () => { becoming props
				// console.log('Updated state:', this.state);
		// 	  });
		// });
		document.addEventListener("keydown", this.handleKeyDown);
    	this.props.socket.on('updateState', (data: string) => {
    		const position: GameState = JSON.parse(data);
    		this.setState({
    		leftPaddleY: position.leftPaddleY,
    		rightPaddleY: position.rightPaddleY,
    		ballPosition: this.state.nextballPosition,
			nextballPosition: position.ballPosition, 
			play: position.play
    		});
    	});
		this.props.socket.on('score', (data: string) => {
			const score: ScoreProps = JSON.parse(data);
			this.score = score;
		});
	}
	componentWillUnmount(): void {
		document.removeEventListener("keydown", this.handleKeyDown);
	}
	 // Handle keydown events
	 handleKeyDown(event: any) {
		let newvalue;
		switch (event.key) {
		  case "w":{
			console.log('this.props.player' + this.props.player);
			if (this.props.player == 1 && this.state.play){
				const data: PaddleMove = {
					paddleY : this.state.leftPaddleY - 10,
					roomID : this.props.roomID,
					uid : this.props.uid,
				};
				this.props.socket.emit("updatePaddle", data);
			}
			else if (this.props.player == 2 && this.state.play){
				const data: PaddleMove = {
					paddleY : this.state.rightPaddleY - 10,
					roomID : this.props.roomID,
					uid : this.props.uid,
				};
				this.props.socket.emit("updatePaddle", data);
			}
		}
			break;
		  case "s":{
			if (this.props.player == 1 && this.state.play){
				const data: PaddleMove = {
					paddleY : this.state.leftPaddleY + 10,
					roomID : this.props.roomID,
					uid : this.props.uid,
				};
				this.props.socket.emit("updatePaddle", data);
			}
			else if (this.props.player == 2 && this.state.play){
				const data: PaddleMove = {
					paddleY : this.state.rightPaddleY + 10,
					roomID : this.props.roomID,
					uid : this.props.uid,
				};
				this.props.socket.emit("updatePaddle", data);
			}
		}
			break;
		  case "c":
			{
				const data: playpause = {
					roomID : this.props.roomID,
					uid : this.props.uid,
					play: true,
				};
				this.props.socket.emit('playPong', data);
			};
			break;
		  case "v":
			this.setState({play : false}, () =>{
				const data: playpause = {
					roomID : this.props.roomID,
					uid : this.props.uid,
					play: false,
				};
				this.props.socket.emit('stopPong', data);
			});
			break;
		  default:
			break;
		}
	  }
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
			</div>
		</div>
		);
	}
}

export default GamePong;