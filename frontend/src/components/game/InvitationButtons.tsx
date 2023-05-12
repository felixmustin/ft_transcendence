import { Component, ReactNode } from "react";
import { invitation } from "./Matchmaking";

export class Invitebuttons extends Component<{invite: invitation[]} & {handleJoinRoom: Function}>{
	render(): ReactNode {
		const { invite, handleJoinRoom } = this.props;
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
			<button className='w-[200px] m-2 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' onClick={() => handleJoinRoom(inv.room)}>
        		Accept Invitation from {inv.origin}
     		</button>
		)
	}
}