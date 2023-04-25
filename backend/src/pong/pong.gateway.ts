import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsException } from '@nestjs/websockets';
import { PongService, matchdata, ScoreProps, PaddleMove, handshake, playpause } from './pong.service';
import { Server, Socket } from 'socket.io';
import {Room} from './room';
import { UseGuards } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { JwtStrategy } from 'src/auth/strategy/jwt.startegy';
import { map } from 'rxjs';
// import { Socket } from 'dgram';

@WebSocketGateway( { cors: true })
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private maproom: Map<string, Room> = new Map();
	private privateroom: Map<string, Room> = new Map();
	private identifiate: Map<string, string> = new Map();

	constructor(private readonly pongService: PongService, private readonly jwtStrategy: JwtStrategy) {

	}
	async handleConnection(client: any, ...args: any[]) {
		// const context = client.createSocket(client);
		// const jwtStrategy = this.injector.get(JwtAuthGuard).getJwtStrategy();
		try {
			const user = await this.jwtStrategy.validateWebSocket(client.handshake.headers);
			// JWT token is valid
			// Do something with the user object
			console.log('user connected : ' + user.id);
			this.identifiate.set(client.id, user.id);
		} catch (err) {
			// JWT token is invalid
			// Close the WebSocket connection
			// client.close();
			this.server.close(client);
			// throw new WsException('Invalid JWT token');
		}
	}
	handleDisconnect(client: any) {
		for (const [key, room] of this.maproom.entries()){
			client.leave(key);
			room.disconnect(client.id);
		}
		for (const [key, room] of this.privateroom.entries()){
			client.leave(key);
			room.disconnect(client.id);
		}
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
		if (this.maproom.get(room)){
			this.maproom.get(room).play();}
	}
	@SubscribeMessage('stopPong')
	async stopPong(client: any, data: playpause){
		const room = data.roomID;
		if (this.maproom.get(room)){
			this.maproom.get(room).pause();}
	}
	@SubscribeMessage('updatePaddle')
	async updatepaddle(client:any, data: PaddleMove){
		// const paddle : PaddleMove = JSON.parse(data);
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
	}
	@SubscribeMessage('find_match')
	async find_match(client: any, data: string) {
		//connecting to room
		const room = this.pongService.looking_room(this.maproom, this.server);
		client.join(room);
		this.maproom.get(room).connect(data);
		// wait for oponent
		let player = 0;
		const waitForPlayer2 = new Promise((resolve) => {
			const roomObj = this.maproom.get(room);
			if (roomObj.players <= 1) {
				player = 1;
			  roomObj.room_complete = resolve;
			} else {
				player = 2;
			  	resolve(resolve);
			}
		  });
		await waitForPlayer2;
		//collect info
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
		let room = this.pongService.generateRandomKey();
		while (this.privateroom.has(room)) {
			room = this.pongService.generateRandomKey();
		}
		this.privateroom.set(room, new Room(room, this.server, this.pongService));
		console.log('send data ');
		client.join(room);
		this.privateroom.get(room).connect(data);
		console.log('room ' + room);
		const score: ScoreProps = {
			player1: this.privateroom.get(room).idp1,
			player2: this.privateroom.get(room).idp2,
			score1: 0,
			score2: 0,
		}
		console.log('check');
		const datamatch: matchdata = {
			roomID: room,
			score: score,
			player: 1,
		}
		client.emit('room_created', datamatch)
	}
	@SubscribeMessage('join_room')
	async join_room(client: any, data: string) {
		//join private room
		const room = data;
		client.join(room);
		console.log('join room 1')
		this.privateroom.get(room).connect(client.id);
		const score: ScoreProps = {
			player1: this.privateroom.get(room).idp1,
			player2: this.privateroom.get(room).idp2,
			score1: 0,
			score2: 0,
		}
		const datamatch: matchdata = {
			roomID: room,
			score: score,
			player: 2,
		}
		console.log('join room 2');
		this.server.to(room).emit('match_found', datamatch);
	}
}
