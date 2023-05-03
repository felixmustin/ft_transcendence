import { MoreThan } from "typeorm";
import { Item } from "./Item";
import { generate } from "rxjs";

export type coordonate = {
	x: number;
	y: number;
}
export type hit = {
	x: boolean;
	y: boolean;
}

export class Pong{
	paddleleft: Item;
	paddleright: Item;
	ball: Item[];
	ballspeedx: number[];
	ballspeedy: number[];
	board: Item;
	or_speed: number;
	paddle_right_speed: number;
	paddle_left_speed: number;
	bonus: Item | undefined;
	which_bonus: number;

//initialisation
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
		this.bonus = undefined;
		this.which_bonus = -1;
		this.paddle_right_speed = 10;
		this.paddle_left_speed = 10;
	}
	reset(){
		this.ballspeedx = [this.or_speed];
		this.ballspeedy = [this.or_speed];
		this.paddleleft.reset();
		this.paddleright.reset();
		this.ball[0].reset();
		this.ball.splice(1, this.ball.length - 1);
		this.bonus = undefined;
		this.which_bonus = -1;
		this.paddle_right_speed = 10;
		this.paddle_left_speed = 10;
	}

// frame 
	updategame(){
		this.ball.forEach((element, index) => {
			if (this.bonus === undefined){
				let x = Math.floor(Math.random() * 1000);
				if (x < 10){
					this.generate_bonus();
				}
			}
			if (element.x > this.board.width / 2){
				const bound: hit = element.move(this.ballspeedx[index], this.ballspeedy[index], [this.paddleright]);
				if (bound.x){
					// console.log('ball hit paddle right hor');
					// element.rebound_hor(this.ballspeedy[index]);
					// element.rebound_hor(this.ballspeedy[index]);
					this.ballspeedx[index] *= -1;
					this.bounce_right(index);
				}
				if (bound.y){
					// element.rebound_vert(this.ballspeedy[index]);
					// element.rebound_vert(this.ballspeedy[index]);
					this.ballspeedy[index] *= -1;
				}
				// this.bounce_right(index);
			}
			else {
				const bound: hit = element.move(this.ballspeedx[index], this.ballspeedy[index], [this.paddleleft]);
				if (bound.x){
					// element.rebound_hor(this.ballspeedy[index]);
					// element.rebound_hor(this.ballspeedy[index]);
					this.ballspeedx[index] *= -1;
					this.bounce_left(index);
				}
				if (bound.y){
					// element.rebound_vert(this.ballspeedy[index]);
					// element.rebound_vert(this.ballspeedy[index]);
					this.ballspeedy[index] *= -1;
				}
				// this.bounce_left(index);
			}
			const bound: hit = element.is_out(this.board);
			if (bound.y){
				// element.rebound_vert(this.ballspeedy[index]);
				// element.rebound_vert(this.ballspeedy[index]);
				this.ballspeedy[index] *= -1;
			}
		});
	}

// bonus gestion
	generate_bonus(){
		if (this.bonus)
			return;
		else{
			this.bonus = new Item (Math.floor(Math.random() * this.board.width), Math.floor(Math.random() * this.board.heigth), 10, 10);
			this.which_bonus = Math.floor(Math.random() * 5);
		}
	}
	more_ball(ind: number){
		const newball = this.ball[0];
		const index = this.ball.length;
		this.ball.push(newball);
		this.more_downward(index);
		this.more_downward(index);
	}
	paddle_quicker(ind: number){
		if (ind === 1)
			this.paddle_left_speed += 10;
		else if (ind === 2)
			this.paddle_right_speed += 10;
	}
	paddle_bigger(ind: number){
		if (ind === 1)
			this.paddleleft.heigth += 10;
		else if (ind === 2)
			this.paddleright.heigth += 10;
	}
	paddle_smaller(ind: number){
		if (ind === 1)
			this.paddleleft.heigth -= 10;
		else if (ind === 2)
			this.paddleright.heigth -= 10;
	}
	activate_bonus(ind: number){
		if (this.which_bonus === 0){
			this.more_ball(ind);
		}
		else if (this.which_bonus === 1){
			this.which_bonus = 5;
		}
		else if (this.which_bonus === 2){
			this.paddle_quicker(ind);
		}
		else if (this.which_bonus === 3){
			this.paddle_bigger(ind);
		}
		else if (this.which_bonus === 4){
			this.paddle_smaller(ind);
		}
		this.bonus = undefined;
		this.which_bonus = -1;
	}

//paddle move
	update_right_paddle(x: number, y:number){
		this.paddleright.move_paddle(x, y, this.ball, 1, this.board);
	}
	update_left_paddle(x: number, y:number){
		this.paddleleft.move_paddle(x, y, this.ball, 0, this.board)
	}

// movement dynamic
	quicker(index: number){
		// if (this.ballspeedx[index] >= this.ballspeedy[index]){
		// 	if (this.ballspeedy[index] > 0)
		// 		this.ballspeedy[index]++;
		// 	else
		// 		this.ballspeedy[index]--;
		// }
		// else{
			if (this.ballspeedx[index] > 0)
				this.ballspeedx[index]++;
			else
				this.ballspeedx[index]--;
		// }
	}
	bounce_right(index: number){
		// this.ballspeedx[index] *= -1;
		// this.ball[index].move_hor(this.ballspeedx[index], [this.paddleright]);
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
		// this.ballspeedx[index] *= -1;
		// this.ball[index].move_hor(this.ballspeedx[index], [this.paddleleft]);
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