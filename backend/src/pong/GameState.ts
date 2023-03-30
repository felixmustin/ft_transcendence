export class GameState{
	paddleleftposition: number;
	paddlerightposition: number;
	ballpositionx: number;
	ballpositiony: number;
	nextballpositionx: number;
	nextballpositiony: number;
	tempballx: number;
	tempbally:number;
	ballspeedx: number;
	ballspeedy: number;
	boardWidth: number;
	boardHeight: number;
	ballRadius: number;
	paddlewidth: number;
	paddlespace: number;
	paddleheight: number;


	constructor() {
		this.paddleleftposition = 160;
		this.paddlerightposition = 160;
		this.ballpositionx = 290;
		this.ballpositiony = 190;
		this.nextballpositionx = 300;
		this.nextballpositiony = 200;
		this.ballspeedx = 10;
		this.ballspeedy = 10;
		this.boardWidth = 600;
		this.boardHeight = 400;
		this.ballRadius = 10;
		this.paddlewidth = 20;
		this.paddlespace = 20;
		this.paddleheight = 80;
	}

	reset(){
		this.paddleleftposition = 160;
		this.paddlerightposition = 160;
		this.ballpositionx = 290;
		this.ballpositiony = 190;
		this.nextballpositionx = 300;
		this.nextballpositiony = 200;
		this.ballspeedx = 10;
		this.ballspeedy = 10;
		this.boardWidth = 600;
		this.boardHeight = 400;
		this.ballRadius = 10;
		this.paddlewidth = 20;
		this.paddlespace = 20;
		this.paddleheight = 80;
	}

	updategame(){
		this.tempballx = this.nextballpositionx;
		this.tempbally = this.nextballpositiony;
		this.calculateBallX();
		this.calculateBallY();
		this.ballpositionx = this.tempballx;
		this.ballpositiony = this.tempbally;
	}

	calculateBallX(){
		if (this.ballpositionx > this.nextballpositionx){
			this.nextballpositionx = this.nextballpositionx - this.ballspeedx;
		}
		else{
			this.nextballpositionx = this.nextballpositionx + this.ballspeedx;
		}
		//calculate bounce right
		if (this.nextballpositionx > this.boardWidth - this.paddlespace - this.paddlewidth - (this.ballRadius * 2) && this.nextballpositionx < this.boardWidth - this.paddlespace - (this.ballRadius * 2) && this.nextballpositiony + (this.ballRadius * 2) > this.paddlerightposition && this.nextballpositiony < this.paddlerightposition +  this.paddleheight){
			this.nextballpositionx -= (this.ballspeedx * 2);
		} // bounce left
		else if (this.nextballpositionx < this.paddlespace + this.paddlewidth && this.nextballpositionx > this.paddlespace && this.nextballpositiony > this.paddleleftposition && this.nextballpositiony < this.paddleleftposition + this.paddleheight){
			this.nextballpositionx += (this.ballspeedx * 2);
		} 
	  }
	
	  calculateBallY(){
		let ballY = 0;
		if (this.ballpositiony > this.nextballpositiony){
			this.nextballpositiony = this.nextballpositiony - this.ballspeedy;
		}
		else{
			this.nextballpositiony = this.nextballpositiony + this.ballspeedy;
		}
		let ballFinalY = this.nextballpositiony;
		//calculate bounce down
		if (this.nextballpositiony > this.boardHeight - (this.ballRadius * 2)){
			this.nextballpositiony -= (this.ballspeedy * 2);
		} // bounce up 
		else if (this.nextballpositiony < 0){
			this.nextballpositiony += (this.ballspeedy * 2);
		}
	  }

	update_right_paddle(rightPaddleY: number){
		this.paddlerightposition = rightPaddleY;
	}

	update_left_paddle(leftPaddleY: number){
		this.paddleleftposition = leftPaddleY;
	}
}