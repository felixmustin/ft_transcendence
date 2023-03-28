import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect, Component } from 'react';
import './pong.css';
import io, {Socket} from 'socket.io-client';

class Right_Paddle extends Component {
	render(){
		const {rightPaddleY} = this.props;
		return (
			<div className="paddle" id="right-paddle" style={{ top: rightPaddleY }} />
		);
	}
}

class Left_Paddle extends Component {
	render() {
		const {leftPaddleY} = this.props;
		return (
			<div className="paddle" id="left-paddle" style={{ top: leftPaddleY }} />
		);
	}
}

class Ball extends Component {
	render() {
		const {ballPositionx, ballPositiony, nextballPositionx, nextballPositiony} = this.props;
		return (
			<div className='ball' style={{ 
				position: 'absolute',
				top: ballPositiony,
				left: ballPositionx,
				width: '20px',
				height: '20px',
				backgroundColor: 'rgba(255, 255, 0, 0.775)',
				borderRadius: '50%',
				transitionProperty: "top, left",
				transitionDuration: "0.1s",
				transitionTimingFunction: "linear",
				...{top: nextballPositiony, left: nextballPositionx},
			  }} />
		);
	}
}

class Game_Board extends Component {
  	render(){ 
	const { leftPaddleY, rightPaddleY, ballPositionx, ballPositiony, nextballPositionx, nextballPositiony } = this.props;
	return (
	<div className="game-board">
		<Left_Paddle leftPaddleY={leftPaddleY} />
        <Right_Paddle rightPaddleY={rightPaddleY} />
        <Ball ballPositionx={ballPositionx} ballPositiony={ballPositiony} nextballPositionx={nextballPositionx} nextballPositiony={nextballPositiony}/>
	</div>
  );}
}

class Score_Container extends React.Component{
	render (){
		const {player1, player2} = this.props;
		return (
			<div className="score-container">
					<div style={{ display: 'flex', justifyContent: 'center', whiteSpace: 'pre-line' }}>
						<p style={{ textAlign: 'center' }}>{"player 1 " + " vs " + "player 2\n\r" + player1 + "|" + player2}</p>
					</div>
				</div>
		);
	}
}

type GamePongProps = {
	roomID: string;
	player: number;
  };

type GameState = {
	player1: number;
	player2: number;
	roomId: string;
	player: number;
	leftPaddleY: number;
	rightPaddleY: number;
	ballPositionx: number;
	ballPositiony: number;
	nextballPositionx: number;
	nextballPositiony: number;
	play: boolean;
  };

class GamePong extends React.Component {
	private socket: any;
	constructor (props: any){
		super(props);
		this.state = {
			player1 : 0,
			player2 : 0,
			roomId : "test",
			player : 0,
			leftPaddleY: 160,
  			rightPaddleY: 160,
  			ballPositionx: 290,
			ballPositiony: 190,
  			nextballPositionx: 300,
			nextballPositiony:200,
			play: false,
		};
		const clientId = uuidv4();
		console.log('hello from constructor');
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}
	componentDidMount(): void {
		this.socket = io("http://127.0.0.1:3001");
		console.log('hello from component did mount ');
		this.socket.on('room', (data: string) => {
    		const room = JSON.parse(data);
			console.log('received room ' + room.roomId + " | " + room.player);
    		this.setState({
				roomId: room.roomId,
				player: room.player,
			  }, () => {
				console.log('Updated state:', this.state);
			  });
		});
		document.addEventListener("keydown", this.handleKeyDown);
    	this.socket.on('updateState', (data: string) => {
    		const position = JSON.parse(data);
    		this.setState({
    		leftPaddleY: position.leftPaddleY,
    		rightPaddleY: position.rightPaddleY,
    		ballPositionx: this.state.nextballPositionx,
			ballPositiony: this.state.nextballPositiony,
			nextballPositionx: position.ballPosition.x, 
			nextballPositiony: position.ballPosition.y,
			play: false,
    		});
    	});
		this.socket.on('score', (data: string) => {
			const score = JSON.parse(data);
			this.setState({
				player1: score.player1,
				player2: score.player2,
			});
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
			if (this.state.player == 1){
				const data = {
					paddleY : this.state.leftPaddleY - 10,
					room : this.state.roomID,
					player : this.state.player,
				};
				this.socket.emit("updatePaddle", JSON.stringify(data));
			}
			else if (this.state.player == 2){
				const data = {
					paddleY : this.state.rightPaddleY - 10,
					room : this.state.roomID,
					player : this.state.player,
				};
				this.socket.emit("updatePaddle", JSON.stringify(data));
			}
		}
			break;
		  case "s":{
			if (this.state.player == 1){
				const data = {
					paddleY : this.state.leftPaddleY + 10,
					room : this.state.roomID,
					player : this.state.player,
				};
				this.socket.emit("updatePaddle", JSON.stringify(data));
			}
			else if (this.state.player == 2){
				const data = {
					paddleY : this.state.rightPaddleY + 10,
					room : this.state.roomID,
					player : this.state.player,
				};
				this.socket.emit("updatePaddle", JSON.stringify(data));
			}
		}
			break;
		  case "c":
			this.setState({play : true}, () =>{
				const data = {
					room : this.props.roomID,
					player : this.props.player,
				};
				this.socket.emit('playPong', JSON.stringify(data));
			});
			break;
		  case "v":
			this.setState({play : false}, () =>{
				const data = {
					room : this.props.roomID,
					player : this.props.player,
				};
				this.socket.emit('stopPong', JSON.stringify(data));
			});
			break;
		  default:
			break;
		}
	  }
	render () {
		console.log('hello from render');
		const {leftPaddleY, rightPaddleY, ballPositionx, ballPositiony, nextballPositionx, nextballPositiony} = this.state;
		return (
		<div>
			<div className="status-container">
				<Score_Container player1={this.state.player1} player2={this.state.player2} />
					<div className="game-board-container">
						<div className="game-board">
							<Game_Board 
							leftPaddleY={leftPaddleY}
							rightPaddleY={rightPaddleY}
							ballPositionx={ballPositionx}
							ballPositiony={ballPositiony}
							nextballPositionx={nextballPositionx}
							nextballPositiony={nextballPositiony}
							 />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default GamePong;