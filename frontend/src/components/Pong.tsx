import ReactDOM from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import './pong.css';
import Banner from './Banner';
import io, {Socket} from 'socket.io-client';

function Game_Board() {
  const [leftPaddleY, setLeftPaddleY] = useState(160);
  const [rightPaddleY, setRightPaddleY] = useState(160);
  const [ballPosition, setBallPosition] = useState({ x: 290, y: 190 });
  const [nextballPosition, setNextBallPosition] = useState({x: 300, y:200});
  const [socket, setSocket] = useState<Socket>(io('ws://127.0.0.1:3001/pong'));

  // for paddle move
  useEffect(() => {
	// Add event listeners for keydown and keyup events
	document.addEventListener("keydown", handleKeyDown);
	document.addEventListener("keyup", handleKeyUp);
  
	// Remove event listeners when the component is unmounted
	return () => {
	  document.removeEventListener("keydown", handleKeyDown);
	  document.removeEventListener("keyup", handleKeyUp);
	};
  }, []);

  // for ball movement
  useEffect(() => {
	// establish connection
	// const newsocket = io('ws://127.0.0.1:3001/pong');

	// setSocket(newsocket);

	// emit start message
	const interval = setInterval(() =>{
		socket.emit('playPong');
	}, 1000);

	// listen to update
	socket.on('updateState', ({ leftPaddleY, rightPaddleY, ballPositionx, ballPositiony }) => {
		setLeftPaddleY(leftPaddleY);
		setRightPaddleY(rightPaddleY);
		setBallPosition({ x: nextballPosition.x, y: nextballPosition.y });
		setNextBallPosition({ x: ballPositionx, y: ballPositiony });
	  });

		return () => {
			socket.off('updateState');
			socket.disconnect();
		  };
		}, []);

  // Handle keydown events
  function handleKeyDown(event) {
	switch (event.key) {
	  case "w":
		socket.emit('updatePaddleL', { leftPaddleY: leftPaddleY - 10 });
		// setLeftPaddleY(y => y - 10);
		break;
	  case "s":
		socket.emit('updatePaddleL', { leftPaddleY: leftPaddleY + 10 });
		// setLeftPaddleY(y => y + 10);
		break;
	  case "ArrowUp":
		socket.emit('updatePaddleR', { leftPaddleY: rightPaddleY - 10 });
		// setRightPaddleY(y => y - 10);
		break;
	  case "ArrowDown":
		socket.emit('updatePaddleR', { leftPaddleY: rightPaddleY + 10 });
		// setRightPaddleY(y => y + 10);
		break;
	  default:
		break;
	}
  }

  // Handle keyup events
  function handleKeyUp(event) {
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

  return (
	<div className="game-board">
	  <div className="paddle" id="left-paddle" style={{ top: leftPaddleY }} />
	  <div className="paddle" id="right-paddle" style={{ top: rightPaddleY }} />
	  <div className='ball' style={{ 
        position: 'absolute',
        top: ballPosition.y,
        left: ballPosition.x,
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
  );
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