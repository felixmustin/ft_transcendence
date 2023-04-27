import { Component } from "react";
import { pose_size } from "./Pong";

export class Balls extends Component<{balls: pose_size[]}>{
	render() {
	  const { balls } = this.props;
	  return (
		<div className='balls'>
		  {balls.map((ball, index) => (
			<Ball key={index} pos={ball.pos} size={ball.size} />
		  ))}
		</div>
	  );
	}
  }

export class Ball extends Component <pose_size> {
	render() {
		const {pos, size} = this.props;
		return (
			<div className='ball' style={{ 
				position: 'absolute',
				top: pos.y,
				left: pos.x,
				width: size.x + 'px',
				height: size.y + 'px',
				backgroundColor: 'rgba(255, 255, 0, 0.775)',
				borderRadius: '50%',
				transitionProperty: "top, left, width, height",
				transitionDuration: "0.1s",
				transitionTimingFunction: "linear",
			  }} />
		);
	}
}