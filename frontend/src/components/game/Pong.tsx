import ReactDOM from 'react-dom/client';
import React, { useState, useEffect, Component } from 'react';
import './pong.css';
import Banner from './Banner';
import io, {Socket} from 'socket.io-client';

class Game_Board extends Component {
	constructor (props){
		super(props);
		console.log('constructor says hi');
		this.state = {
  			leftPaddleY: 160,
  			rightPaddleY: 160,
  			ballPositionx: 290,
			ballPositiony: 190,
  			nextballPositionx: 300,
			nextballPositiony:200,
		};
		this.socket = io("ws://127.0.0.1:3001");
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}

	// for event handling
// 	useEffect(() => {
// 	// Add event listeners for keydown and keyup events
// 	document.addEventListener("keydown", handleKeyDown);
// 	document.addEventListener("keyup", handleKeyUp);

// 	//listening to updatesate
// 	console.log('test2');
// 	socket.on('updateState', (data) => {
// 		const position = JSON.parse(data);
// 		console.log("update received " + position.leftPaddleY + " | " + position.ballPosition.x + " | " + position.ballPosition.y);
// 		this.state.leftPaddleY = position.leftPaddleY;
// 		this.state.rightPaddleY = position.rightPaddleY;
// 		this.state.ballPosition = this.state.nextballPosition;
// 		this.state.nextBallPosition = position.ballPosition;
// 		console.log('data updated');
// 	  });

// 	// Remove event listeners when the component is unmounted
// 	return () => {
// 	  document.removeEventListener("keydown", handleKeyDown);
// 	  document.removeEventListener("keyup", handleKeyUp);
// 	};
//   }, []);
componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);

    //listening to updatesate
    console.log('test2');
    this.socket.on('updateState', (data) => {
      const position = JSON.parse(data);
      console.log("update received " + position.leftPaddleY + " | " + position.ballPosition.x + " | " + position.ballPosition.y);
      this.setState({
        leftPaddleY: position.leftPaddleY,
        rightPaddleY: position.rightPaddleY,
        ballPositionx: this.state.nextballPositionx,
		ballPositiony: this.state.nextballPositiony,
        nextballPositionx: position.ballPosition.x, 
		nextballPositiony: position.ballPosition.y,
      });
	  console.log('data updated  ' + this.state.leftPaddleY + " | " + this.state.nextballPositionx + " | " + this.state.nextballPositiony);
	//   this.setState({leftPaddleY: position.leftPaddleY});
	//   this.setState({rightPaddleY: position.rightPaddleY});
	// //   this.setState({ballPosition: this.state.nextballPosition});
	//   this.setState({nextballPosition: position.ballPosition});
    });
  }

//   componentDidUpdate(prevProps, prevState) {
//     // Check if the state has changed and force a re-render if it has
//     if (prevState.data !== this.state.data) {
//       this.forceUpdate();
//     }
//   }

  // Remove event listeners when the component is unmounted
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }

  // Handle keydown events
	handleKeyDown(event) {
	const { leftPaddleY, rightPaddleY } = this.state;
	let newvalue;
	switch (event.key) {
	  case "w":
		console.log('paddle up');
		newvalue = leftPaddleY - 10;
		// this.setState({leftPaddleY: leftPaddleY - 10}, () => {
			this.socket.emit("updatePaddleL", newvalue.toString());
		//   });
		// setLeftPaddleY(y => y - 10);
		break;
	  case "s":
		console.log('paddle down ');
		newvalue = leftPaddleY + 10;
		// this.setState({ leftPaddleY: leftPaddleY + 10 }, () => {
			this.socket.emit("updatePaddleL", newvalue.toString());
		//   });
		// setLeftPaddleY(y => y + 10);
		break;
	  case "ArrowUp":
		newvalue = rightPaddleY - 10;
		// this.setState({ rightPaddleY: rightPaddleY - 10 }, () => {
			this.socket.emit("updatePaddleR", newvalue.toString());
		//   });
		// setRightPaddleY(y => y - 10);
		break;
	  case "ArrowDown":
		newvalue = rightPaddleY + 10;
		// this.setState({ rightPaddleY: rightPaddleY + 10 }, () => {
			this.socket.emit("updatePaddleR", newvalue.toString());
		//   });
		// setRightPaddleY(y => y + 10);
		break;
	  case "c":
		console.log("playPong");
		this.socket.emit('playPong');
		break;
	case "v":
		console.log("stopPong");
		this.socket.emit('stopPong');
		break;
	  default:
		break;
	}
  }

  // Handle keyup events
	handleKeyUp(event) {
	switch (event.key) {
	  case "w":
		// setLeftPaddleY(y => y + 10);
		break;
	  case "s":
		// setLeftPaddleY(y => y - 10);
		break;
	  case "ArrowUp":
		// setRightPaddleY(y => y + 10);
		break;
	  case "ArrowDown":
		// setRightPaddleY(y => y - 10);
		break;
	  default:
		break;
	}
  }

  	render(){ 
	const { leftPaddleY, rightPaddleY, ballPosition, nextballPosition } = this.state;
	return (
	<div className="game-board">
	  <div className="paddle" id="left-paddle" style={{ top: leftPaddleY }} />
	  <div className="paddle" id="right-paddle" style={{ top: rightPaddleY }} />
	  <div className='ball' style={{ 
        position: 'absolute',
        top: this.state.ballPositiony,
        left: this.state.ballPositionx,
        width: '20px',
        height: '20px',
        backgroundColor: 'rgba(255, 255, 0, 0.775)',
        borderRadius: '50%',
        animationName: 'move-ball',
        animationDuration: '1s',
        animationIterationCount: 'infinite',
        animationDirection: 'normal',
        animationTimingFunction: 'linear'
      }} />
	</div>
  );}
}

  

class GamePong extends React.Component {
	constructor (props){
		super(props);
		this.state = {
			score : "player 1 " + " vs " + "player 2\n\r" + "0|0"
		};
	}
	render () {
		const buttons = [
			{text: 'home', link: '/home'},
			{text: 'pong', link: '/pong'},
			{text: 'signup', link: '/register'},
			{text: 'login', link: '/login'}
		  ];
		return (
		<div>
			< Banner title="Welcome to Pong tournament!" buttons={buttons}/>
			<div className="status-container">
				<div className="score-container">
					<div style={{ display: 'flex', justifyContent: 'center', whiteSpace: 'pre-line' }}>
						<p style={{ textAlign: 'center' }}>{this.state.score}</p>
					</div>
				</div>
					<div className="game-board-container">
						<div className="game-board">
							<Game_Board />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default GamePong;