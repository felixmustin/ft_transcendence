import { Inject, Injectable } from '@nestjs/common';
import {Room} from './room';
import { Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/entities/game.entity';
import { Repository } from 'typeorm';
import { Profile } from 'src/entities/profile.entity';
import { JwtStrategy } from 'src/auth/strategy/jwt.startegy';
import { UserService } from 'src/user/user.service';
import { WebSocketServer } from '@nestjs/websockets';
import { PongGateway } from './pong.gateway';
import { coordonate } from './game/Pong';

export type handshake = {
	uid : string,
	users: string[],
}
export type token = {
	token : string,
}
export type auth = {
	reconnectionAttempts: number,
	reconnectionDelay: number,
	autoConnect: boolean,
	auth: token 
}
export type ScoreProps = {
	player1: string,
	player2: string,
	score1: number,
	score2: number,
}
export type matchdata = {
	roomID: string,
	score: ScoreProps,
	player: number,
}
export type PaddleMove = {
	paddle: coordonate,
	roomID: string,
	uid: string,
}
type ballPosition = {
	x: number,
	y: number,
}
export type GameStateupdate = {
	leftPaddleY: number,
	rightPaddleY: number,
	ballPosition: ballPosition,
	nextballPosition: ballPosition,
	play: boolean,
};
export type playpause = {
	roomID: string,
	uid:string,
	play: boolean,
}

export type gameResume = {
	player1_id: number,
	player2_id: number,
	player1_score: number,
	player2_score: number,
}

@Injectable()
export class PongService {
	private maproom: Map < string, Room > = new Map();
	private privateroom: Map < string, Room > = new Map();
	private identitymap: Map < string, Profile > = new Map();

	constructor(
		@InjectRepository(Game)
		private gameRepository: Repository<Game>,
		private readonly jwtStrategy: JwtStrategy, 
		private readonly userservice: UserService
	) {}

	async login(client: any, server: Server){
		try {
			const id = await this.jwtStrategy.validateWebSocket(client.handshake.headers);
			const user: Profile = await this.userservice.findUserProfileById(id.id);
			this.identitymap.set(client.id, user);
		  } catch (error) {
			console.log('Error occurred during login:', error);
			server.close(client);
		  }
	}

	logout(client: any){
		for (const [key, room] of this.maproom.entries()){
			client.leave(key);
			room.disconnect(client.id);
		}
		for (const [key, room] of this.privateroom.entries()){
			client.leave(key);
			room.disconnect(client.id);
		}
	}

	play(client: any, data: playpause){
		const room = data.roomID;
		if (this.maproom.get(room)){
			this.maproom.get(room).play();}
	}

	pause(client: any, data: playpause){
		const room = data.roomID;
		if (this.maproom.get(room)){
			this.maproom.get(room).pause();}
	}

	paddelupdate(client:any, data: PaddleMove){
		const room = data.roomID;
		this.maproom.get(room).update_paddle(data.paddle, client.id);
	}

	// setServer(server: Server) {
	// 	this.server = server;
	//   }
	async find_match(client: any, data: string, server: Server){
		//connecting to room
		const room = this.looking_room(this.maproom, server);
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
			player1: this.identifiate(this.maproom.get(room).idp1).username,
			player2: this.identifiate(this.maproom.get(room).idp2).username,
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
	create_room(client: any, data: string, server: Server){
		//create private room
		let room = this.generateRandomKey();
		while (this.privateroom.has(room)) {
			room = this.generateRandomKey();
		}
		this.privateroom.set(room, new Room(room, server, this));
		console.log('send data ');
		client.join(room);
		this.privateroom.get(room).connect(data);
		console.log('room ' + room);
		const score: ScoreProps = {
			player1: this.identifiate(this.privateroom.get(room).idp1).username,
			player2: this.identifiate(this.privateroom.get(room).idp2).username,
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
	join_room(client: any, data: string, server: Server){
		//join private room
		const room = data;
		client.join(room);
		console.log('join room 1')
		this.privateroom.get(room).connect(client.id);
		const score: ScoreProps = {
			player1: this.identifiate(this.privateroom.get(room).idp1).username,
			player2: this.identifiate(this.privateroom.get(room).idp2).username,
			score1: 0,
			score2: 0,
		}
		const datamatch: matchdata = {
			roomID: room,
			score: score,
			player: 2,
		}
		console.log('join room 2');
		server.to(room).emit('match_found', datamatch);
	}
	looking_room(map: Map<string, Room>, server: Server): string {
		for (const [key, value] of map.entries()) {
		  if (value.players === 1) {
			return key;
		  }
		}
		for (const [key, value] of map.entries()) {
		  if (value.players === 0) {
			return key;
		  }
		}
		// If no available room found, create a new room with a unique key
		let key = Math.random().toString(36).substr(2, 9);
		while (map.has(key)) {
			key = Math.random().toString(36).substr(2, 9);
		}
		const newRoom = new Room(key, server, this);
		map.set(key, newRoom);
		console.log('created room : ' + key);
		return key;
	  }

	disconnecting(map: Map<string, Room>, rooms: string[]){
		rooms.forEach(element => {
			map[element].players--;
		});
	}

	getClientRoom(client: any) {
		// Get the Set object containing the IDs of all the rooms that the client is in
		const clientRooms: [] = client.rooms;
	  
		// Loop over the IDs in the Set object
		for (let roomId of clientRooms) {
		  // If the ID is not the ID of the client, it must be the ID of the room that the client is in
		  if (roomId !== client.id) {
			// Return the name of the room
			return roomId;
		  }
		}
	  
		// If we get here, the client is not in any rooms
		return null;
	}

	wait_player2(room: Room){
		
	}

	generateRandomKey(): string {
		let key = "";
		const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		for (let i = 0; i < 4; i++) {
		  const randomIndex = Math.floor(Math.random() * possibleChars.length);
		  key += possibleChars.charAt(randomIndex);
		}
		return key;
	}

	async saveGame(scoreData: gameResume): Promise<Game> {
		const game = new Game();
		game.player1_id = scoreData.player1_id;
		game.player2_id = scoreData.player2_id;
		game.player1_score = scoreData.player1_score;
		game.player2_score = scoreData.player2_score;

		return await this.gameRepository.save(game);
	}

	identifiate(id: string): Profile{
		return (this.identitymap.get(id));
	}
}
