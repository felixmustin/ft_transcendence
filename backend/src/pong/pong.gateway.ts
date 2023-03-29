import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { PongService } from './pong.service';
import { Server } from 'socket.io';
import {Room} from './room';
import { Socket } from 'dgram';

@WebSocketGateway( { cors: true })
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private maproom: Map<string, Room> = new Map();

	constructor(private readonly pongService: PongService) {

	}
	handleConnection(client: any, ...args: any[]) {
		console.log("user connected");
		if (!this.pongService.getClientRoom(client)){
			const room = this.pongService.looking_room(this.maproom, this.server);
			client.join(room);
			this.maproom.get(room).players++;
			const data = {
				roomId: room,
				player: this.maproom.get(room).players,
			};
			client.emit('room', JSON.stringify(data));
			console.log(client.id + " : room is " + data.roomId + ' and player is ' + data.player);
		}
	}
	handleDisconnect(client: any) {
		console.log('user disconnected');
		const room = this.pongService.getClientRoom(client);
		if (this.maproom.has(room) && this.maproom.get(room).finished){
			this.pongService.disconnecting(this.maproom, room);
			this.maproom.get(room).players--;
			client.leave(room);
		}
		else if (this.maproom.has(room)){
			this.maproom.get(room).pause();
			this.maproom.get(room).players--;
		}
	}	
	afterInit(server: any) {
		console.log("websocket initialized");
	}
	// server
	@WebSocketServer() server: Server;

	//calculate
	@SubscribeMessage('playPong')
	async playPong(client: any, data: any) {
		const room = this.pongService.getClientRoom(client);
		console.log('play');
		if (this.maproom.get(room)){
			this.maproom.get(room).play();}
	}
	@SubscribeMessage('stopPong')
	async stopPong(client: any, data: any){
		const room = this.pongService.getClientRoom(client);
		console.log('pause');
		if (this.maproom.get(room)){
			this.maproom.get(room).pause();}
	}
	@SubscribeMessage('updatePaddle')
	async updatepaddle(client:any, data: string){
		const paddle = JSON.parse(data)
		const room = this.pongService.getClientRoom(client);
		this.maproom.get(room).update_paddle(paddle.paddleY, paddle.player);
	}
	// @SubscribeMessage('handshake')
	// async handshake(client: any, data: any){
	// 	console.info('handshake received from ' + client.id);

	// 	const reconnected = data.values(this.server.sockets.sockets).includes(client.id);

	// 	if (reconnected) {
	// 		console.info('this user has reconnected');
	// 	}
	// 	else {
	// 		console.info('new connection');
	// 	}
	// }
}
