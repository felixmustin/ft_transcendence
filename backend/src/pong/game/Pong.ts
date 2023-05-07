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
		this.paddle_right_speed = 1;
		this.paddle_left_speed = 1;
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
		this.paddle_right_speed = 1;
		this.paddle_left_speed = 1;
	}

// frame 
	updategame(){
		if (this.bonus === undefined && this.which_bonus !== 5 && this.which_bonus !== -100){
			let x = Math.floor(Math.random() * 1000);
			if (x < 10){
				this.generate_bonus();
			}
		}
		for (let index = 0; index < this.ball.length; index++) {
			const element = this.ball[index];
			const bound: hit = element.is_out(this.board);
			if (bound.y){
				this.ballspeedy[index] *= -1;
			}
			if (bound.x){
				this.ball.splice(index, 1);
				this.ballspeedx.splice(index, 1);
				this.ballspeedy.splice(index, 1);
			}
			if (element.x > this.board.width / 2){
				const hit: hit = element.move(this.ballspeedx[index], this.ballspeedy[index], [this.paddleright]);
				if (hit.x){
					this.ballspeedx[index] *= -1;
					this.bounce_right(index);
				}
				if (hit.y){
					this.ballspeedy[index] *= -1;
					this.quicker(index);
				}
			}
			else {
				const hit: hit = element.move(this.ballspeedx[index], this.ballspeedy[index], [this.paddleleft]);
				if (hit.x){
					this.ballspeedx[index] *= -1;
					this.bounce_left(index);
				}
				if (hit.y){
					this.ballspeedy[index] *= -1;
					this.quicker(index);
				}
			}
		}
	}

// bonus gestion
	generate_bonus(){
		// if (this.bonus != undefined)
		// 	return;
		// else{
			this.bonus = new Item ((Math.floor(Math.random() * (this.board.width - 40)) + 20), Math.floor(Math.random() * (this.board.heigth - 20)), 20, 20);
			this.which_bonus = Math.floor(Math.random() * 4);
			if (this.ball.length > 1 && this.which_bonus === 0){
				this.which_bonus = Math.floor(Math.random() * 3) + 1;
			}
			// this.which_bonus = 0;
		// }
	}
	more_ball(ind: number){
		const newball = new Item(this.ball[0].x, this.ball[0].y, this.ball[0].width, this.ball[0].heigth);
		newball.or_x = this.ball[0].or_x;
		newball.or_y = this.ball[0].or_y;
		newball.or_width = this.ball[0].or_width;
		newball.or_heigth = this.ball[0].or_heigth;

		const index = this.ball.length;
		this.ball.push(newball);
		this.ballspeedx.push([...this.ballspeedx][0]);
		this.ballspeedy.push([...this.ballspeedy][0]);
		this.more_downward(index);
		this.more_downward(index);
		console.log(JSON.stringify(this.ball) + '\n-------------------------------------------------------------');
	}
	paddle_quicker(ind: number){
		if (ind === 1)
			this.paddle_left_speed += 1;
		else if (ind === 2)
			this.paddle_right_speed += 1;
	}
	paddle_bigger(ind: number){
		if (ind === 1)
			this.paddleleft.heigth += 20;
		else if (ind === 2)
			this.paddleright.heigth += 20;
	}
	paddle_smaller(ind: number){
		if (ind === 2)
			this.paddleleft.heigth -= 20;
		else if (ind === 1)
			this.paddleright.heigth -= 20;
	}
	activate_bonus(ind: number){
		this.bonus = undefined;
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
		if (this.which_bonus !== 5){
			this.which_bonus = -1;
		}
	}

//paddle move
	update_right_paddle(x: number, y:number){
		this.paddleright.move_paddle(x * this.paddle_right_speed, y * this.paddle_right_speed, this.ball, 1, this.board);
		if (this.bonus && this.paddleright.is_in(this.bonus)){
			this.activate_bonus(2);
		}
	}
	update_left_paddle(x: number, y:number){
		this.paddleleft.move_paddle(x * this.paddle_left_speed, y * this.paddle_left_speed, this.ball, 0, this.board)
		if (this.bonus && this.paddleleft.is_in(this.bonus)){
			this.activate_bonus(1);
		}
	}

// movement dynamic
	quicker(index: number){
			if (this.ballspeedx[index] > 0)
				this.ballspeedx[index]++;
			else if (this.ballspeedx[index] < 0)
				this.ballspeedx[index]--;
			else {
				if (this.ball[index].x > this.board.width / 2){
					this.ballspeedx[index]--;
				}
				else{
					this.ballspeedx[index]++;
				}
			}
	}
	bounce_right(index: number){
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