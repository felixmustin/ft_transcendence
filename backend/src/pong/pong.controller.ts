import { Controller, Post, Body } from '@nestjs/common';
import { PongService } from './pong.service';

@Controller('pong')
export class PongController {
	constructor(private readonly pongService: PongService) {}
	@Post('/pong')
		playPong(@Body() data) {
		const { leftPaddleY, rightPaddleY, ballPosition, nextballPosition } = data;

		// Do calculations to update ball position based on paddles positions
		const ballX = this.pongService.calculateBallX(leftPaddleY, rightPaddleY, ballPosition.x, ballPosition.y, nextballPosition.x, nextballPosition.y);
		const ballY = this.pongService.calculateBallY(ballPosition.y, nextballPosition.y);
		if (ballX < 0 || ballX > 600){
			return {x: 290, y: 190};
		}
		return { x: ballX, y: ballY };
	}
}
