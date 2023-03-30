import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { PongService, matchdata, ScoreProps, PaddleMove, handshake, playpause } from './pong.service';
import { Server } from 'socket.io';
import {Room} from './room';
// import { Socket } from 'dgram';

@WebSocketGateway( { cors: true })
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private maproom: Map<string, Room> = new Map();

	constructor(private readonly pongService: PongService) {

	}
	handleConnection(client: any, ...args: any[]) {
		console.log("user connected");
	}
	handleDisconnect(client: any) {
		console.log('user disconnected');
	}	
	afterInit(server: any) {
		console.log("websocket initialized");
	}
	// server
	@WebSocketServer() server: Server;

	//calculate
	@SubscribeMessage('playPong')
	async playPong(client: any, data: playpause) {
		const room = data.roomID;
		console.log('play');
		if (this.maproom.get(room)){
			this.maproom.get(room).play();}
	}
	@SubscribeMessage('stopPong')
	async stopPong(client: any, data: playpause){
		const room = data.roomID;
		console.log('pause');
		if (this.maproom.get(room)){
			this.maproom.get(room).pause();}
	}
	@SubscribeMessage('updatePaddle')
	async updatepaddle(client:any, data: PaddleMove){
		// const paddle : PaddleMove = JSON.parse(data);
		console.log('update paddle received' + data.roomID + ' | ' + data.uid);
		const room = data.roomID;
		this.maproom.get(room).update_paddle(data.paddleY, data.uid);
	}
	@SubscribeMessage('handshake')
	async handshake(client:any, data: any){
		const uid = client.id;
  		const users = ['user1', 'user2', 'user3'];
		const shake: handshake = {
			uid : uid,
			users: users,
		}
  		client.emit('handshake-response', shake);

  		console.log('Handshake received successfully');
	}
	@SubscribeMessage('find_match')
	async find_match(client: any, data: string) {
		//connecting to room
		const room = this.pongService.looking_room(this.maproom, this.server);
		client.join(room);
		this.maproom.get(room).connect(client.id);
		console.log('connect to room ' + client.id);
		// wait for oponent
		let player = 0;
		const waitForPlayer2 = new Promise((resolve) => {
			const roomObj = this.maproom.get(room);
			if (roomObj.players <= 1) {
				player = 1;
				console.log('waiting ' + client.id);
			  roomObj.room_complete = resolve;
			} else {
				player = 2;
				console.log('goingthrough ' + client.id);
			  	resolve(resolve);
				console.log('resolved ' + client.id);
			}
		  });
		await waitForPlayer2;
		//collect info
		console.log('after await ' + client.id);
		const score: ScoreProps = {
			player1: this.maproom.get(room).idp1,
			player2: this.maproom.get(room).idp2,
			score1: 0,
			score2: 0,
		};
		const datamatch: matchdata = {
			roomID: room,
			score: score,
			player: player,
		};
		client.emit('match_found', datamatch);
	}
	@SubscribeMessage('create_room')
	async create_room(client: any, data: string) {
		//create private room
	}
	@SubscribeMessage('join_room')
	async join_room(client: any, data: string) {
		//join private room
	}
}
