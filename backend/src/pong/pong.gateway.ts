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
let intervalid;

@WebSocketGateway( { cors: true })
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly pongService: PongService) {
	}
	// 3 required but still have to look what it is 
	handleConnection(client: any, ...args: any[]) {
		console.log("user connected");		
	}
	handleDisconnect(client: any) {
		console.log("user disconnected");
		clearInterval(intervalid);
	}
	afterInit(server: any) {
		console.log("loading connection after init socket");
	}
	// server
	@WebSocketServer() server: Server;

	//calculate
	@SubscribeMessage('playPong')
	async playPong(client: any, data: any) {
		// const { leftPaddleY, rightPaddleY, ballPosition, nextballPosition } = data;
		console.log('hello from play pong ');
		// Do calculations to update ball position based on paddles positions
		intervalid = setInterval( () => {
			console.log('emiting');
			const ballX = this.pongService.calculateBallX(paddleleftposition, paddlerightposition, ballpositionx, ballpositiony, nextballpositionx, nextballpositiony);
			const ballY = this.pongService.calculateBallY(ballpositiony, nextballpositiony);
			ballpositionx = nextballpositionx;
			ballpositiony = nextballpositiony;
			nextballpositionx = ballX;
			nextballpositiony = ballY;
			const data = { 
				leftPaddleY: paddleleftposition,
				rightPaddleY: paddlerightposition, 
				ballPosition: {x: ballX, y: ballY},
			};
			this.server.emit('updateState', JSON.stringify(data));
			if (ballX < 0 || ballX > 590){
				this.server.emit('ballOut');
				ballpositionx = 290;
				ballpositiony = 190;
				nextballpositionx = 300;
				nextballpositiony = 200;
			}
		}, 100);
		// this.server.emit('updateState', { leftPaddleY: paddleleftposition, rightPaddleY: paddlerightposition, ballpositionx: ballX, ballpositiony: ballY });
	}
	@SubscribeMessage('stopPong')
	async stopPong(client: any, data: any){
		console.log('stop pong');
		clearInterval(intervalid);
	}
	@SubscribeMessage('updatePaddleL')
	async updateleftpaddle(client:any, data: any){
		console.log('update padddle received');
		const leftPaddleY = parseInt(data);

		paddleleftposition = leftPaddleY;
	}
	@SubscribeMessage('updatePaddleR')
	async updaterightpaddle(client:any, data: any){
		const rightPaddleY = parseInt(data);

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
