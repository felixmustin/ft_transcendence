import { coordonate } from "./Pong";

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
		if (this.is_horizontaly_in(other) && this.is_verticaly_in(other)){
			return true;
		}
		else{
			return false;
		}
	}
	reset(){
		this.x = this.or_x;
		this.y = this.or_y;
		this.width = this.or_width;
		this.heigth = this.or_heigth;
	}
	move_hor(x: number){
		this.x += x;
	}
	move_vert(y: number){
		this.y += y;
	}
	move(x: number, y:number){
		this.move_hor(x);
		this.move_vert(y);
	}
	move_absolute(x:number, y:number){
		this.x = x;
		this.y = y;
	}
	rebound_hor(x: number){
		this.move_hor(x);
		this.move_hor(x);
	}
	rebound_vert(y: number){
		this.move_vert(y);
		this.move_vert(y);
	}
	center(): coordonate{
		const center = {
			x: this.x + (this.width / 2),
			y: this.y + (this.heigth / 2),
		}
		return center;
	}
}