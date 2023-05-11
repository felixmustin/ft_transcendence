import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketServer, WsException } from '@nestjs/websockets';
import { not } from 'joi';
import { Server } from 'socket.io';
import { JwtStrategy } from 'src/auth/strategy/jwt.startegy';
import { Profile } from 'src/entities/profile.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

export type notification = {
	type: string,
	origin: string,
	target: string,
	data: string,
}

export type notifications = {
	name: string,
	notifs: notification[],
  }

export type noti_payload = {
	type: string,
	target: string | undefined,
	data: string | undefined,
}

export type status = {
	username: string,
	status: number,
}

export type statusgame = {
	status: number,
	room: string,
}

@Injectable()
export class StatusService {
	private id_to_profile: Map < string, Profile > = new Map();
	private profile_to_id: Map < string, string > = new Map();
	private notification: Map < string, notification[]> = new Map();
	// private connected: Set<Profile> = new Set();

	constructor(
		private readonly jwtStrategy: JwtStrategy, 
		private readonly userservice: UserService,
		@InjectRepository(Profile)
    	private userProfileRepository: Repository<Profile>,
	) {}
	async login(client: any){
		try {
			const payload = await this.jwtStrategy.validateWebSocket(client.handshake.headers);
			const profile = await this.userservice.findUserProfileById(payload.id);
			profile.statusid = 1;
			await this.userProfileRepository.save(profile)
			this.register_user(client.id, profile);
		} catch (error) {
			throw new WsException('Unauthorized');
		}
	}

	async logout(client: any){
		const payload: statusgame = {
			status: 0,
			room: '',
		}
		this.update_status(client, payload)
		this.delete_id(client.id);
	}
	
	delete_self_notif(client: any){
		const user = this.id_to_profile.get(client.id);
		const notif = this.notification.get(user.username)
		if (notif){
			for (let i = 0; i < notif.length; i++){
				if (notif[i].target === user.username){
					notif.splice(i, 1);
				}
			}
		}
		this.notification.set(user.username, notif);
		console.log('delete self ' + JSON.stringify(notif));
		client.emit('notification', this.build_noti(user.username));
	}
	delete_game_notif(client: any){
		const user = this.id_to_profile.get(client.id);
		const notif = this.notification.get(user.username)
		if (notif){
			for (let i = 0; i < notif.length; i++){
				if (notif[i].type === 'game'){
					notif.splice(i, 1);
				}
			}
		}
		this.notification.set(user.username, notif);
		console.log('deleting game notif ' + notif);
		client.emit('notification', this.build_noti(user.username));
	}
	delete_message_notif(client:any){
		const user = this.id_to_profile.get(client.id);
		const notif = this.notification.get(user.username)
		if (notif){
			for (let i = 0; i < notif.length; i++){
				if (notif[i].type === 'message'){
					notif.splice(i, 1);
				}
			}
		}
		this.notification.set(user.username, notif);
		client.emit('notification', this.build_noti(user.username));
	}
	delete_friend_notif(client: any){
		const user = this.id_to_profile.get(client.id);
		const notif = this.notification.get(user.username);
		if (notif){
			for (let i = 0; i < notif.length; i++){
				if (notif[i].type === 'friend'){
					notif.splice(i, 1);
				}
			}
		}
		this.notification.set(user.username, notif);
		client.emit('notification', this.build_noti(user.username));
	}
	set_notification(client:any, notif: noti_payload){
		const user = this.id_to_profile.get(client.id);
		if (notif.target !== user.username && notif.type === 'game'){
			this.delete_self_notif(client);
		}
		const not: notification = {
			origin: user.username,
			type: notif.type,
			target: notif.target ? notif.target : this.id_to_profile.get(client.id).username,
			data: notif.data,
		}
		if (this.notification.has(notif.target)){
			const table = this.notification.get(notif.target);
			table.push(not);
			this.notification.set(notif.target, table);
		}
		else{
			this.notification.set(not.target, [not]);
		}
	}
	get_notification(client: any){
		const user = this.id_to_profile.get(client.id);
		const notifs = this.notification.get(user.username);
		client.emit('notification', notifs);
	}
	register_user(id : string, user: Profile){
		this.id_to_profile.set(id, user);
		this.profile_to_id.set(user.username, id);
	}
	delete_id(id: string){
		const user = this.id_to_profile.get(id);
		this.id_to_profile.delete(id);
		this.profile_to_id.delete(user.username);
	}
	delete_user(user: Profile){
		const id = this.profile_to_id.get(user.username);
		this.notification.delete(user.username);
		this.profile_to_id.delete(user.username);
		this.id_to_profile.delete(id);
	}
	build_noti(user: string): notifications {
		const ret: notifications = {
			name: user,
			notifs: this.notification.get(user),
		}
		return ret;
	}
	async emitNotifications(server: Server){
		for (const [key, value] of this.notification) {
			if (!value.length){
				this.notification.delete(key);
			}
			else{
				const id = this.profile_to_id.get(key);
				const noti = this.build_noti(key);
				server.to(id).emit('notification', noti);
				// console.log('emiting notif to ' + key);
			}
		}
	}
	async update_status(client: any, data: statusgame){
		const user = this.id_to_profile.get(client.id);
		const profile = await this.userservice.findUserProfileById(user.id);
		profile.statusid = data.status;
		profile.gameroom = data.room;
		await this.userProfileRepository.save(profile);
	}
}
