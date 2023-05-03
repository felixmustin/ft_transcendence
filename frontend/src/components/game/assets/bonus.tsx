import PropTypes from 'prop-types';
import { coordonate } from '../Pong';
import { Component } from 'react';

interface GameboardIconProps {
	bonus?: coordonate;
	which_bonus: number;
  }

export class GameboardIcon extends Component <GameboardIconProps> {
	render() {
		const {which_bonus, bonus} = this.props;
		let icon: string;
		if (which_bonus === 0)
			icon = 'frontend/src/components/game/assets/double_ball.jpg';
		else if (which_bonus === 1)
			icon = 'frontend/src/components/game/assets/bonusball.png';
		else if (which_bonus === 2)
			icon = 'frontend/src/components/game/assets/quicker.png';
		else if (which_bonus === 3)
			icon = 'frontend/src/components/game/assets/bigger.png';
		else 
			icon = 'frontend/src/components/game/assets/smaller2.png';
		if (bonus === undefined){
			return null;
		}
		return (
			<div className="gameboard-icon" style={{ left: bonus.x, top: bonus.y }}>
				<img src={icon} alt="Gameboard Icon" style={{ width: '10px', height: '10px' }} />
			</div>
		  );
	}
  }

export default GameboardIcon;