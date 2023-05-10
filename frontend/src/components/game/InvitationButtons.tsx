import { Component, ReactNode } from "react";
import { invitation } from "./Matchmaking";

export class Invitebuttons extends Component<{invite: invitation[]} & {handleJoinRoom: Function}>{
	render(): ReactNode {
		const { invite, handleJoinRoom } = this.props;
		for (let i = 0; i < invite.length; i++){
			console.log(JSON.stringify(invite[i]))}
		if (!invite.length){
			return null;
		}
		return (
			<div className='inv_butt'>
				invitations
		  {invite.map((inv, index) => (
			<Inv_button key={index} inv={inv} handleJoinRoom={handleJoinRoom} />
		  ))}
		</div>
		)
	}
}

export class Inv_button extends Component<{inv: invitation} & {handleJoinRoom: Function}> {
	render(): ReactNode {
		const {inv, handleJoinRoom } = this.props;
		return (
			<button onClick={() => handleJoinRoom(inv.room)}>
        		Accept Invitation from {inv.origin}
     		</button>
		)
	}
}