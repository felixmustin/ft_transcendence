import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "http";
import { StatusService } from "./status.service";

@WebSocketGateway( { cors: true })
export class statusGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	// server
	@WebSocketServer() server: Server;

	constructor(private readonly statusService: StatusService) {}
	async handleConnection(client: any, ...args: any[]) {
		this.statusService.login(client, this.server);
	}
	handleDisconnect(client: any) {
		this.statusService.logout(client, this.server);
	}
	afterInit(server: any) {
		console.log("websocket initialized");
	}
	@SubscribeMessage('playPong')
	async playhandler (){

	}
}