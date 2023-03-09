// import React from 'react';
import ReactDOM from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import './pong.css';
import Banner from './Banner';

function Game_Board() {
  const [leftPaddleY, setLeftPaddleY] = useState(160);
  const [rightPaddleY, setRightPaddleY] = useState(160);
  const [ballPosition, setBallPosition] = useState({ x: 290, y: 190 });
  const [nextballPosition, setNextBallPosition] = useState({x: 300, y:200});

  useEffect(() => {
	// Add event listeners for keydown and keyup events
	document.addEventListener("keydown", handleKeyDown);
	document.addEventListener("keyup", handleKeyUp);
	// try to communicate with the backen
	const interval = setInterval(() => {
		fetch('http://127.0.0.1:3001/pong/pong', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
			leftPaddleY,
			rightPaddleY,
			ballPosition,
			nextballPosition
		  })
		})
		.then(response => response.json())
		.then(data => {
			setBallPosition({x: nextballPosition.x, y:nextballPosition.y}),
			setNextBallPosition({ x: data.x, y: data.y });
		})
		.catch(error => console.error(error));
	  }, 1000);

	// Remove event listeners when the component is unmounted
	return () => {
		clearInterval(interval);
		document.removeEventListener("keydown", handleKeyDown);
		document.removeEventListener("keyup", handleKeyUp);
	};
  });
  // Handle keydown events
  function handleKeyDown(event) {
	switch (event.key) {
	  case "w":
		setLeftPaddleY(y => y - 10);
		break;
	  case "s":
		setLeftPaddleY(y => y + 10);
		break;
	  case "ArrowUp":
		setRightPaddleY(y => y - 10);
		break;
	  case "ArrowDown":
		setRightPaddleY(y => y + 10);
		break;
	  default:
		break;
	}
  }

  // Handle keyup events
  function handleKeyUp(event) {
	switch (event.key) {
	  case "w":
		setLeftPaddleY(y => y + 10);
		break;
	  case "s":
		setLeftPaddleY(y => y - 10);
		break;
	  case "ArrowUp":
		setRightPaddleY(y => y + 10);
		break;
	  case "ArrowDown":
		setRightPaddleY(y => y - 10);
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