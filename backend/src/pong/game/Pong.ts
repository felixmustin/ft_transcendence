import { MoreThan } from "typeorm";
import { Item } from "./Item";

export type coordonate = {
	x: number;
	y: number;
}

export class Pong{
	paddleleft: Item;
	paddleright: Item;
	ball: Item[];
	ballspeedx: number[];
	ballspeedy: number[];
	board: Item;
	or_speed: number;

	constructor() {
		const paddlewidth = 20;
		const paddlespace = 20;
		const paddlepose = 160;
		const paddleheigth = 80;
		const ballsize = 20;
		this.or_speed = 5;
		this.board = new Item(0, 0, 600, 400);
		this.paddleleft = new Item(paddlespace, paddlepose, paddlewidth, paddleheigth);
		this.paddleright = new Item((this.board.width - paddlespace) - paddlewidth, paddlepose, paddlewidth, paddleheigth);
		this.ball = [new Item(300, 200, ballsize, ballsize)];
		this.ballspeedx = [this.or_speed];
		this.ballspeedy = [this.or_speed];
	}

	reset(){
		this.ballspeedx = [this.or_speed];
		this.ballspeedy = [this.or_speed];
		this.paddleleft.reset();
		this.paddleright.reset();
		this.ball[0].reset();
		this.ball.splice(1, this.ball.length - 1);
	}

	updategame(){
		this.ball.forEach((element, index) => {
			element.move(this.ballspeedx[index], this.ballspeedy[index]);
			if (this.ballspeedx[index] > 0 && element.is_in(this.paddleright)){
				this.bounce_right(index);
			}
			else if (this.ballspeedx[index] < 0 && element.is_in(this.paddleleft)){
				this.bounce_left(index);
			}
			if (!element.is_verticaly_in(this.board)){
				this.ballspeedy[index] *= -1;
				element.rebound_vert(this.ballspeedy[index]);
			}
			if (!element.is_horizontaly_in(this.board)){
				this.reset();
			}
		});
	}

	update_right_paddle(x: number, y:number){
		this.paddleright.move(x, y);
	}

	update_left_paddle(x: number, y:number){
		this.paddleleft.move(x, y)
	}

	quicker(index: number){
		console.log('quicker summoned : ' + this.ballspeedx[index] + ' | ' + this.ballspeedy[index]);
		if (this.ballspeedx[index] >= this.ballspeedy[index]){
			if (this.ballspeedy[index] > 0)
				this.ballspeedy[index]++;
			else
				this.ballspeedy[index]--;
		}
		else{
			if (this.ballspeedx[index] > 0)
				this.ballspeedx[index]++;
			else
				this.ballspeedx[index]--;
		}
	}

	bounce_right(index: number){
		this.ballspeedx[index] *= -1;
		this.ball[index].rebound_hor(this.ballspeedx[index]);
		const ball = this.ball[index].center();
		const fifth = this.paddleright.heigth / 5;
		if (ball.y < this.paddleright.y + fifth){
			this.more_upward(index);
			this.more_upward(index);
		}
		else if (ball.y < this.paddleright.y + (2 * fifth)){
			this.more_upward(index);
		}
		else if (ball.y < this.paddleright.y + (3 * fifth)){}
		else if (ball.y < this.paddleright.y + (4 * fifth)){
			this.more_downward(index);
		}
		else{
			this.more_downward(index);
			this.more_downward(index);
		}
		this.quicker(index);
	}

	bounce_left(index: number){
		this.ballspeedx[index] *= -1;
		this.ball[index].rebound_hor(this.ballspeedx[index]);
		const ball = this.ball[index].center();
		const fifth = this.paddleleft.heigth / 5;
		if (ball.y < this.paddleleft.y + fifth){
			this.more_upward(index);
			this.more_upward(index);
		}
		else if (ball.y < this.paddleleft.y + (2 * fifth)){
			this.more_upward(index);
		}
		else if (ball.y < this.paddleleft.y + (3 * fifth)){}
		else if (ball.y < this.paddleleft.y + (4 * fifth)){
			this.more_downward(index);
		}
		else{
			this.more_downward(index);
			this.more_downward(index);
		}
		this.quicker(index);
	}

	more_upward(index: number){
		this.ballspeedy[index]--;
		if (this.ballspeedy[index] < 0){
			if (this.ballspeedx[index] > 0)
				this.ballspeedx[index]--;
			else{
				this.ballspeedx[index]++;
			}
		}
		else {
			if (this.ballspeedx[index] < 0){
				this.ballspeedx[index]--;
			}
			else{
				this.ballspeedx[index]++;
			}

		}
	}

	more_downward(index: number){
		this.ballspeedy[index]++;
		if (this.ballspeedy[index] > 0){
			if (this.ballspeedx[index] > 0)
				this.ballspeedx[index]--;
			else{
				this.ballspeedx[index]++;
			}
		}
		else {
			if (this.ballspeedx[index] < 0){
				this.ballspeedx[index]--;
			}
			else{
				this.ballspeedx[index]++;
			}

		}
	}
}