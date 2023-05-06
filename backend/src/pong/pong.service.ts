import { Inject, Injectable } from '@nestjs/common';
import {Room} from './room';
import { Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/entities/game.entity';
import { Repository } from 'typeorm';
import { Profile } from 'src/entities/profile.entity';
import { JwtStrategy } from 'src/auth/strategy/jwt.startegy';
import { UserService } from 'src/user/user.service';
import { WebSocketServer, WsException } from '@nestjs/websockets';
import { PongGateway } from './pong.gateway';
import { coordonate } from './game/Pong';
import { User } from 'src/entities/user.entity';
import { number, string } from 'joi';
import { Socket } from 'dgram';

export type handshake = {
	uid : string,
	users: string[],
	data: string,
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
	private idroomap: Map <string, string[]> = new Map();

	constructor(
		@InjectRepository(Game)
		private gameRepository: Repository<Game>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
			throw new WsException('Unauthorized');
		  }
	}

	logout(client: any, server: Server){
		// for (const [key, room] of this.maproom.entries()){
		// 	client.leave(key);
		// 	room.disconnect(client.id);
		// }
		// for (const [key, room] of this.privateroom.entries()){
		// 	client.leave(key);
		// 	room.disconnect(client.id);
		// }
		const roomID = this.getClientRoom(client);
		console.log('llogout called with : ' + client.id);
		console.log('gives : ' + roomID);
		for (let i = 0; i < roomID?.length; i++){
			const room = this.get_room(roomID[i]);
			room?.disconnect(client.id);
			client.leave(roomID);
		}
		this.idroomap.delete(client.id);
	}

	play(client: any, data: playpause){
		const room = this.get_room(data.roomID);
		if (client.id === room?.idp1 || client.id === room?.idp2){
			room?.play();}
	}

	pause(client: any, data: playpause){
		const room = this.get_room(data.roomID);
		if (client.id === room?.idp1 || client.id === room?.idp2){
			room?.pause();}
	}

	paddelupdate(client:any, data: PaddleMove){
		const room = this.get_room(data.roomID);
		// console.log('received : ' + JSON.stringify(data));
		room?.update_paddle(data.paddle, client.id);
	}

	async find_match(client: any, data: string, server: Server){
		//connecting to room
		const room = this.looking_room(this.maproom, server);
		client.join(room);
		this.addClientToRoom(client.id, room);
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
			player1: this.identifiate(this.maproom.get(room).idp1)?.username,
			player2: this.identifiate(this.maproom.get(room).idp2)?.username,
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
		let found: boolean = false;
		let roomID: string = '';
		for (const [key, value] of this.privateroom.entries()) {
			if (value.players === 0) {
			  client.join(value.id);
			  this.addClientToRoom(client.id, value.id);
			  value.connect(data);
			  found = true;
			  console.log('found empty room');
			  break ;
			}
		  }
		if (!found){
			roomID = this.generateRandomKey();
			while (this.privateroom.has(roomID)) {
				roomID = this.generateRandomKey();
			}
			this.privateroom.set(roomID, new Room(roomID, server, this));
			console.log('send data ');
			client.join(roomID);
			this.addClientToRoom(client.id, roomID);
			this.privateroom.get(roomID).connect(data);
		}
		// console.log('room ' + room);
		const score: ScoreProps = {
			// error exception username 
			player1: this.identifiate(this.privateroom.get(roomID).idp1)?.username,
			player2: this.identifiate(this.privateroom.get(roomID).idp2)?.username,
			score1: 0,
			score2: 0,
		}
		// console.log('check');
		const datamatch: matchdata = {
			roomID: roomID,
			score: score,
			player: 1,
		}
		client.emit('room_created', datamatch)
	}
	join_room(client: any, data: string, server: Server){
		//join private room
		const room = this.get_room(data);
		client.join(data);
		this.addClientToRoom(client.id, data);
		// console.log('join room : ' + JSON.stringify(room));
		room.connect(client.id);
		const score: ScoreProps = {
			player1: this.identifiate(room.idp1).username,
			player2: this.identifiate(room.idp2).username,
			score1: 0,
			score2: 0,
		}
		const datamatch: matchdata = {
			roomID: room.id,
			score: score,
			player: 2,
		}
		// console.log('join room 2');
		server.to(room.id).emit('match_found', datamatch);
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

	disconnecting(client: any, id: string){
		const room = this.get_room(id);
		room.disconnect(client.id);
	}

	getClientRoom(client: any): string[] {
		return this.idroomap.get(client.id);
	}

	get_room(roomID: string): Room{
		// if (isNaN(Number(room.charAt(0)))) {
		// 	console.log('id : ' + room + ' found room : ' + this.maproom.get(room)?.id);
		// 	// console.log('The first character is a letter');
		// 	return this.maproom.get(room);
		// } 
		// else {
		// 	console.log('id : ' + room + ' found room : ' + this.privateroom.get(room)?.id);
		// 	// console.log('The first character is a number');
		// 	return this.privateroom.get(room);
		// }
		let room = this.maproom.get(roomID);
		if (!room){
			room = this.privateroom.get(roomID);
		}
		return room;
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

		return await this.addGameToUserProfile(game);
	}

  	async addGameToUserProfile(game: Game) {
  	  const player1 = await this.userservice.findUserById(game.player1_id);
  	  const player2 = await this.userservice.findUserById(game.player2_id);
	
  	  // Create a new game instance and set its properties
  	  const newGame = new Game();
  	  newGame.player1_id = game.player1_id;
  	  newGame.player2_id = game.player2_id;
  	  newGame.player1_score = game.player1_score;
  	  newGame.player2_score = game.player2_score;
	
  	  // Save the new game to the repository
  	  const savedGame = await this.gameRepository.save(newGame);
	
  	  // Add the saved game to both player1 and player2 profile games
  	  player1.profile.games.push(savedGame);
  	  player2.profile.games.push(savedGame);

  	  // Update the player1 and player2 profiles if they won the game
  	  if (game.player1_score > game.player2_score) {
  	    player1.profile.gamesWon++;
  	  } else {
  	    player2.profile.gamesWon++;
  	  }

  	  // Save the updated profiles
  	  await this.userRepository.save(player1);
  	  await this.userRepository.save(player2);
	
  	  return savedGame;
  	}
	rematch(client: any, roomID:string){
		console.log('rematch service');
		const room = this.get_room(roomID);
		console.log('rooom id service is ' + room.id);
		room.rematch_handler(client.id);
	}
	identifiate(id: string): Profile{
		return (this.identitymap.get(id));
	}
	desidentifiate(id:string){
		this.identitymap.delete(id);
	}
	addClientToRoom(clientId: string, roomId: string) {
		const clientsInRoom = this.idroomap.get(clientId);
		if (clientsInRoom && !clientsInRoom.includes(roomId)){
			clientsInRoom.push(roomId);
		}
		else if (!clientsInRoom){
			console.log('map entry created for ' + clientId + ' with ' + roomId);
			const key = clientId;
			const entry = [roomId];
			this.idroomap.set(key, entry);
		}
	}
	  
}
