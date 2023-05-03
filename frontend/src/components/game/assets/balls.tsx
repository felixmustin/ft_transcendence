import { Component } from "react";
import { pose_size } from "../Pong";

export class Balls extends Component<{balls: pose_size[]} & { which_bonus: number }>{
	render() {
	  const { balls, which_bonus } = this.props;
	  return (
		<div className='balls'>
		  {balls.map((ball, index) => (
			<Ball key={index} pos={ball.pos} size={ball.size} which_bonus={which_bonus} />
		  ))}
		</div>
	  );
	}
  }

export class Ball extends Component <pose_size & { which_bonus: number }> {
	render() {
		const {pos, size, which_bonus} = this.props;
		return (
			<div className='ball' style={{ 
				position: 'absolute',
				top: pos.y,
				left: pos.x,
				width: size.x + 'px',
				height: size.y + 'px',
				backgroundColor: which_bonus === 5 ? 'red' : 'rgba(255, 255, 0, 0.775)',
				borderRadius: '50%',
				transitionProperty: "top, left, width, height",
				transitionDuration: "0.1s",
				transitionTimingFunction: "linear",
			  }} />
		);
	}
}