import { coordonate } from '../Pong';
import { Component } from 'react';
import bigger from './bigger.png';
import bonusball from './bonusball.png';
import doubleball from './double_ball.jpg';
import quicker from './quicker.png';
import smaller from './smaller2.png';

interface GameboardIconProps {
	bonus?: coordonate;
	which_bonus: number;
  }

export class GameboardIcon extends Component <GameboardIconProps> {
	render() {
		const {which_bonus, bonus} = this.props;
		let icon: string;
		if (which_bonus === 0)
			icon = doubleball;
		else if (which_bonus === 1)
			icon = bonusball;
		else if (which_bonus === 2)
			icon = quicker;
		else if (which_bonus === 3)
			icon = bigger;
		else 
			icon = smaller;
		if (bonus === undefined || which_bonus === -1 || which_bonus === 5){
			return null;
		}
		return (
			<div className="gameboard-icon">
				<img src={icon} alt="Gameboard Icon" style={{ 
					position: 'absolute',
					width: '20px', 
					height: '20px', 
					left: bonus.x, 
					top: bonus.y }} />
			</div>
		  );
	}
  }

export default GameboardIcon;