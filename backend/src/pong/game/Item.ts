import { coordonate, hit } from "./Pong";

export class Item {
	x: number;
	y: number;
	width: number;
	heigth: number;
	or_x: number;
	or_y: number;
	or_width: number;
	or_heigth: number;

	constructor(x:number, y:number, width: number, heigth:number){
		this.x = x;
		this.y = y;
		this.width = width;
		this.heigth = heigth;
		this.or_x = this.x;
		this.or_y = this.y;
		this.or_width = this.width;
		this.or_heigth = this.heigth;
	}
	is_verticaly_in(other: Item): boolean{
		if (this.y + this.heigth > other.y && this.y < other.y + other.heigth){
			return true;
		}
		else{
			return false;
		}
	}
	is_horizontaly_in(other:Item): boolean{
		if (this.x + this.width > other.x && this.x < other.x + other.width){
			return true;
		}
		else{
			return false;
		}
	}
	is_in(other: Item): boolean{
		const ret: hit = {
			x: this.is_horizontaly_in(other),
			y: this.is_verticaly_in(other),
		}
		if (ret.x && ret.y)
			return true;
		else
			return false;
	}
	is_horizontaly_out(other: Item): boolean{
		if (this.x < other.x || this.x + this.width > other.x + other.width){
			return true;
		}
		else{
			return false;
		}
	}
	is_verticaly_out(other: Item): boolean{
		if (this.y < other.y || this.y + this.heigth > other.y + other.heigth){
			return true;
		}
		else{
			return false;
		}
	}
	is_out(other: Item): hit{
		const ret: hit = {
			x: this.is_horizontaly_out(other),
			y: this.is_verticaly_out(other),
		}
		return ret;
	}
	reset(){
		this.x = this.or_x;
		this.y = this.or_y;
		this.width = this.or_width;
		this.heigth = this.or_heigth;
	}
	move_hor(x: number, other: Item[]): boolean {
		this.x += x;
		for (let i = 0; i < other.length; i++) {
			if (this.is_in(other[i])) {
				this.rebound_hor(x);
				return true;
			}
		}
		return false;
	}	
	move_vert(y: number, other: Item[]): boolean{
		this.y += y;
		for (let i = 0; i < other.length; i++) {
		  const element = other[i];
		  if (this.is_in(element)){
			this.rebound_vert(y);
			return true;
		  }
		}
		return false;
	  }
	move(x: number, y:number, other: Item[]): hit{
		const ret: hit = {
			x: this.move_hor(x, other),
			y: this.move_vert(y, other),
		}
		return ret;
	}
	move_paddle(x: number, y: number, other: Item[], tag: number, board: Item){
		this.x += x;
		for (let i = 0; i < other.length; i++){
			if (this.is_in(other[i])){
				this.x -= x;
				break ;
			}
		}
		this.y += y;
		for (let i = 0; i < other.length; i++){
			if (this.is_in(other[i])){
				this.y -= y;
				break ;
			}
		}
		if (tag === 0){
			this.limit_left_paddle(board);
		}
		else if (tag === 1){
			this.limit_right_paddle(board);
		}
	}
	limit_left_paddle(board: Item){
		if (this.left() < board.left()){
			this.set_left(board.left());
		}
		if (this.top() < board.top()){
			this.set_top(board.top());
		}
		if (this.bottom() > board.bottom()){
			this.set_bottom(board.bottom());
		}
		const right = board.right() / 2;
		if (this.right() > right){
			this.set_right(right);
		}
	}
	limit_right_paddle(board: Item){
		const left = board.right() / 2;
		if (this.left() < left){
			this.set_left(left);
		}
		if (this.top() < board.top()){
			this.set_top(board.top());
		}
		if (this.bottom() > board.bottom()){
			this.set_bottom(board.bottom());
		}
		if (this.right() > board.right()){
			this.set_right(board.right());
		}
	}
	move_absolute(x:number, y:number){
		this.x = x;
		this.y = y;
	}
	rebound_hor(x: number){
		this.x -= x;
	}
	rebound_vert(y: number){
		this.y -= y;
	}

// info useful
	center(): coordonate{
		const center = {
			x: this.x + (this.width / 2),
			y: this.y + (this.heigth / 2),
		}
		return center;
	}
	left():number{
		return this.x;
	}
	right():number{
		return this.x + this.width;
	}
	top():number{
		return this.y;
	}
	bottom():number{
		return this.y + this.heigth;
	}
	set_right(x: number){
		this.x = x - this.width;
	}
	set_bottom(x: number){
		this.y = x - this.heigth;
	}
	set_left(x: number){
		this.x = x;
	}
	set_top(x: number){
		this.y = x;
	}
}