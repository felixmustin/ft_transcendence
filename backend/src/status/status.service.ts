import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { Server } from 'http';
import { JwtStrategy } from 'src/auth/strategy/jwt.startegy';
import { Profile } from 'src/entities/profile.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class StatusService {
	private identitymap: Map < string, Profile > = new Map();
	// private connected: Set<Profile> = new Set();

	constructor(
		private readonly jwtStrategy: JwtStrategy, 
		private readonly userservice: UserService,
		@InjectRepository(Profile)
    	private userRepository: Repository<Profile>,
	) {}
	async login(client: any, server: Server){
		try {
			const id = await this.jwtStrategy.validateWebSocket(client.handshake.headers);
			const user: Profile = await this.userservice.findUserProfileById(id.id);
			user.statusid = 1;
			await this.userRepository.save(user);
			this.identitymap.set(client.id, user);
			console.log('logged ' + user.username);
		} catch (error) {
			console.log('Error occurred during login:', error);
			throw new WsException('Unauthorized');
		}
	}

	async logout(client: any, server: Server){
		console.log('delogged ' + this.identitymap.get(client.id).username);
		const user = this.identitymap.get(client.id)
		user.statusid = 0;
		await this.userRepository.save(user);
		this.identitymap.delete(client.id);
	}
}
