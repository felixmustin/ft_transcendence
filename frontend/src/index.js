// import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import React, { useState, useEffect } from 'react';
import ./login.js

function Square(props) {
	return (
	  <button className="square" onClick={props.onClick}>
		{props.value}
	  </button>
	);
  }
  
  class Board extends React.Component {
	renderSquare(i) {
	  return (
		<Square
		  value={this.props.squares[i]}
		  onClick={() => this.props.onClick(i)}
		/>
	  );
	}
  
	render() {
	  return (
		<div>
		  <div className="board-row">
			{this.renderSquare(0)}
			{this.renderSquare(1)}
			{this.renderSquare(2)}
		  </div>
		  <div className="board-row">
			{this.renderSquare(3)}
			{this.renderSquare(4)}
			{this.renderSquare(5)}
		  </div>
		  <div className="board-row">
			{this.renderSquare(6)}
			{this.renderSquare(7)}
			{this.renderSquare(8)}
		  </div>
		</div>
	  );
	}
  }
  
  class Game extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
		history: [
		  {
			squares: Array(9).fill(null)
		  }
		],
		stepNumber: 0,
		xIsNext: true
	  };
	}
  
	handleClick(i) {
	  const history = this.state.history.slice(0, this.state.stepNumber + 1);
	  const current = history[history.length - 1];
	  const squares = current.squares.slice();
	  if (calculateWinner(squares) || squares[i]) {
		return;
	  }
	  squares[i] = this.state.xIsNext ? "X" : "O";
	  this.setState({
		history: history.concat([
		  {
			squares: squares
		  }
		]),
		stepNumber: history.length,
		xIsNext: !this.state.xIsNext
	  });
	}
  
	jumpTo(step) {
	  this.setState({
		stepNumber: step,
		xIsNext: (step % 2) === 0
	  });
	}
  
	render() {
	  const history = this.state.history;
	  const current = history[this.state.stepNumber];
	  const winner = calculateWinner(current.squares);
  
	  const moves = history.map((step, move) => {
		const desc = move ?
		  'Go to move #' + move :
		  'Go to game start';
		return (
		  <li key={move}>
			<button onClick={() => this.jumpTo(move)}>{desc}</button>
		  </li>
		);
	  });
  
	  let status;
	  if (winner) {
		status = "Winner: " + winner;
	  } else {
		status = "Next player: " + (this.state.xIsNext ? "X" : "O");
	  }
  
	  return (
		<div className="game">
		  <div className="game-board">
			<Board
			  squares={current.squares}
			  onClick={i => this.handleClick(i)}
			/>
		  </div>
		  <div className="game-info">
			<div>{status}</div>
			<ol>{moves}</ol>
		  </div>
		</div>
	  );
	}
  }
  
  // ========================================
  
  
  function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
	  [1, 4, 7],
	  [2, 5, 8],
	  [0, 4, 8],
	  [2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

function Game_Board() {
  const [leftPaddleY, setLeftPaddleY] = useState(160);
  const [rightPaddleY, setRightPaddleY] = useState(160);

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
	  <div className='ball'/>
    </div>
  );
}

  

class GamePong extends React.Component {
	constructor (props){
		super(props);
		this.state = {
			score : "placeholder"
		};
	}
	render () {
		return (
			<div className="game">
		  <div className="game-board">
			<Game_Board
			//   squares={current.squares}
			//   onClick={i => this.handleClick(i)}
			/>
		  </div>
		  <div className="status">
			<div>{this.state.score}</div>
		  </div>
		</div>
		);
	}
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);