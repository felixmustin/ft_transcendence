import { Component } from "react";
import { pose_size } from "../Pong";

export class Right_Paddle extends Component<pose_size> {
	render(){
		const {pos, size} = this.props;
		return (
			<div className="paddle" id="right-paddle" style={{
				top: pos.y + "px",
				left: pos.x + "px",
				width: size.x + "px",
				height: size.y + "px",
				backgroundColor: 'blue',
				position: 'absolute',
				transitionProperty: "top, left, width, height",
				transitionDuration: "0.05s",
				transitionTimingFunction: "linear",
			  }} />
		);
	}
}

export class Left_Paddle extends Component<pose_size> {
	render() {
		const {pos, size} = this.props;
		return (
			<div className="paddle" id="left-paddle" style={{
				top: pos.y + "px",
				left: pos.x + "px",
				width: size.x + "px",
				height: size.y + "px",
				backgroundColor: 'blue',
				position: 'absolute',
				transitionProperty: "top, left, width, height",
				transitionDuration: "0.05s",
				transitionTimingFunction: "linear",
			  }} />
		);
	}
}
