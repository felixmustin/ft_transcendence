import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { StatusService, noti_payload } from "./status.service";

@WebSocketGateway( { cors: true })
export class statusGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	// server
	@WebSocketServer() server: Server;

	constructor(private readonly statusService: StatusService) {
		setInterval(() => this.statusService.emitNotifications(this.server), 1000);
	}
	async handleConnection(client: any, ...args: any[]) {
		this.statusService.login(client);
	}
	handleDisconnect(client: any) {
		this.statusService.logout(client);
	}
	afterInit(server: any) {
	}
	@SubscribeMessage('send-notif')
	async send_notif (client: any, notif: noti_payload){
		this.statusService.set_notification(client, notif);
	}
	@SubscribeMessage('get-notif')
	async get_notif (client : any){
		this.statusService.get_notification(client);
	}
	@SubscribeMessage('game-visited')
	async game_visite( client: any){
		this.statusService.delete_game_notif(client);
	}
	@SubscribeMessage('friend-visited')
	async friend_visite( client: any){
		this.statusService.delete_friend_notif(client);
	}
	@SubscribeMessage('message-visited')
	async message_visite( client: any){
		this.statusService.delete_message_notif(client);
	}
	@SubscribeMessage('self-visited')
	async self_visit( client: any){
		this.statusService.delete_self_notif(client);
	}
	@SubscribeMessage('update_status')
	async update_status(client: any, data: number){
		this.statusService.update_status(client, data);
	}
}