// import { Controller, Post, Body } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { PongService } from './pong.service';
import { Server } from 'socket.io';

let paddleleftposition = 160;
let paddlerightposition = 160;
let ballpositionx = 290;
let ballpositiony = 190;
let nextballpositionx = 300;
let nextballpositiony = 200;

@WebSocketGateway({ cors: true })
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly pongService: PongService) {}
	// 3 required but still have to look what it is 
	handleConnection(client: any, ...args: any[]) {
	}
	handleDisconnect(client: any) {
		
	}
	afterInit(server: any) {
		
	}
	// server
	@WebSocketServer() server: Server;

	//calculate
	@SubscribeMessage('playPong')
	async playPong(client: any, data: any) {
		// const { leftPaddleY, rightPaddleY, ballPosition, nextballPosition } = data;

		// Do calculations to update ball position based on paddles positions
		const ballX = this.pongService.calculateBallX(paddleleftposition, paddlerightposition, ballpositionx, ballpositiony, nextballpositionx, nextballpositiony);
		const ballY = this.pongService.calculateBallY(ballpositiony, nextballpositiony);
		if (ballX < 0 || ballX > 590){
			this.server.emit('ballOut');
			return {x: 295, y: 195};
		}
		this.server.emit('updateState', { leftPaddleY: paddleleftposition, rightPaddleY: paddlerightposition, ballpositionx: ballX, ballpositiony: ballY });
		return { x: ballX, y: ballY };
	}
	@SubscribeMessage('updatePaddleL')
	async updateleftpaddle(client:any, data: any){
		const {leftPaddleY} = data;

		paddleleftposition = leftPaddleY;
	}
	@SubscribeMessage('updatePaddleR')
	async updaterightpaddle(client:any, data: any){
		const {rightPaddleY} = data;

		paddlerightposition = rightPaddleY;
	}
	// @Post('/pong')
	// 	playPong(@Body() data) {
	// 	const { leftPaddleY, rightPaddleY, ballPosition, nextballPosition } = data;

	// 	// Do calculations to update ball position based on paddles positions
	// 	const ballX = this.pongService.calculateBallX(leftPaddleY, rightPaddleY, ballPosition.x, ballPosition.y, nextballPosition.x, nextballPosition.y);
	// 	const ballY = this.pongService.calculateBallY(ballPosition.y, nextballPosition.y);
	// 	if (ballX < 0 || ballX > 590){
	// 		return {x: 295, y: 195};
	// 	}
	// 	return { x: ballX, y: ballY };
	// }
}
