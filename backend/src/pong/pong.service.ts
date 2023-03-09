import { Injectable } from '@nestjs/common';

@Injectable()
export class PongService {
  private boardWidth = 600; // Width of the game board in pixels
  private boardHeight = 400; // Height of the game board in pixels
  private ballRadius = 10; // Radius of the ball in pixels
  private ballSpeed = 20; // Speed of the ball in pixels per frame
  private ballAngle = 45; // Initial angle of the ball in degrees
  private paddlewidth = 20; // paddle width 
  private paddlespace = 20; // space between paddle and bord
  private paddleheight = 80; // height of the paddle

  calculateBallX(leftPaddleY: number, rightPaddleY: number, ballpositionx: number, ballpositiony: number, nextballpositionx: number, nextballpositiony: number): number {
    let ballx = 0;
	if (ballpositionx > nextballpositionx){
		ballx = nextballpositionx - this.ballSpeed - this.ballRadius;
	}
	else{
		ballx = nextballpositionx + this.ballSpeed - this.ballRadius;
	}
	let ballFinalX = ballx;
	//calculate bounce
	if (ballx > this.boardWidth - this.paddlespace - this.paddlewidth && ballx < this.boardWidth - this.paddlespace && nextballpositiony > rightPaddleY - (this.paddleheight / 2) && nextballpositiony < rightPaddleY + ( this.paddleheight / 2)){
		ballFinalX -= (this.ballSpeed * 2);
	}
	else if (ballx < this.paddlespace + this.paddlewidth && ballx > this.paddlespace && nextballpositiony > leftPaddleY - (this.paddleheight / 2) && nextballpositiony < leftPaddleY + ( this.paddleheight / 2)){
		ballFinalX += (this.ballSpeed * 2);
	} 
    return ballFinalX;
  }

  calculateBallY(ballPosition: number, nextballposition: number): number {
	let ballY = 0;
    if (ballPosition > nextballposition){
		ballY = nextballposition - this.ballSpeed - this.ballRadius;
	}
	else{
		ballY = nextballposition + this.ballSpeed - this.ballRadius;
	}
	let ballFinalY = ballY;
	//calculate bounce
	if (ballY > this.boardHeight - this.ballRadius){
    	ballFinalY -= (this.ballSpeed * 2);
	}
	else if (ballY < 0 + this.ballRadius){
		ballFinalY += (this.ballSpeed * 2);
	}
    return ballFinalY;
  }
}
