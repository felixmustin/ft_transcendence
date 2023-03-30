import { Injectable } from '@nestjs/common';
import {Room} from './room';
import { Server } from 'socket.io';

export type handshake = {
	uid : string,
	users: string[],
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
	paddleY: number,
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

@Injectable()
export class PongService {
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
		let key = Math.random().toString(36).substr(0, 9);
		while (map.has(key)) {
			key = Math.random().toString(36).substr(0, 9);
		}
		const newRoom = new Room(key, server);
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

	// getUidFronSocketId = (id: string) => object.keys(this.server.sockets.sockets).find((uid) => this.server.sockets.sockets[uid] === id);
//   private boardWidth = 600; // Width of the game board in pixels
//   private boardHeight = 400; // Height of the game board in pixels
//   private ballRadius = 10; // Radius of the ball in pixels
//   private ballSpeed = 10; // Speed of the ball in pixels per frame
// //   private ballAngle = 45; // Initial angle of the ball in degrees
//   private paddlewidth = 20; // paddle width 
//   private paddlespace = 20; // space between paddle and bord
//   private paddleheight = 80; // height of the paddle

//   calculateBallX(leftPaddleY: number, rightPaddleY: number, ballpositionx: number, ballpositiony: number, nextballpositionx: number, nextballpositiony: number): number {
//     let ballx = 0;
// 	if (ballpositionx > nextballpositionx){
// 		ballx = nextballpositionx - this.ballSpeed;
// 	}
// 	else{
// 		ballx = nextballpositionx + this.ballSpeed;
// 	}
// 	let ballFinalX = ballx;
// 	//calculate bounce right
// 	if (ballx > this.boardWidth - this.paddlespace - this.paddlewidth - this.ballRadius && ballx < this.boardWidth - this.paddlespace - this.ballRadius && nextballpositiony + this.ballRadius > rightPaddleY && nextballpositiony < rightPaddleY +  this.paddleheight){
// 		ballFinalX -= (this.ballSpeed * 2);
// 	} // bounce left
// 	else if (ballx < this.paddlespace + this.paddlewidth && ballx > this.paddlespace && nextballpositiony + this.ballRadius > leftPaddleY && nextballpositiony < leftPaddleY + this.paddleheight){
// 		ballFinalX += (this.ballSpeed * 2);
// 	} 
//     return ballFinalX;
//   }

//   calculateBallY(ballPosition: number, nextballposition: number): number {
// 	let ballY = 0;
//     if (ballPosition > nextballposition){
// 		ballY = nextballposition - this.ballSpeed;
// 	}
// 	else{
// 		ballY = nextballposition + this.ballSpeed;
// 	}
// 	let ballFinalY = ballY;
// 	//calculate bounce down
// 	if (ballY > this.boardHeight - this.ballRadius){
//     	ballFinalY -= (this.ballSpeed * 2);
// 	} // bounce up 
// 	else if (ballY < 0){
// 		ballFinalY += (this.ballSpeed * 2);
// 	}
//     return ballFinalY;
//   }
}
