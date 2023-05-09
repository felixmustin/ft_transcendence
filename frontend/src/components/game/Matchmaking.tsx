import React, { useState, useEffect } from "react";
import SocketContext, { ISocketContextState } from '../../context/Socket';
import GamePong, {GamePongProps, ScoreProps} from "./Pong";
import FormJoinRoom from "./FormJoinRoom";
import { noti_payload, notifications } from "../../App";

type matchdata = {
	roomID: string,
	score: ScoreProps,
	player: number,
}
type props = {
  statusocket: ISocketContextState,
}
type invitation = {
  origin: string,
  room: string,
}

function Matchmaking(props: props) {
  const { statusocket } = props;
  const { SocketState, SocketDispatch } = React.useContext(SocketContext);
  const [match, setMatch] = useState<GamePongProps | null>(null);
  const [waiting, setwaiting] = useState<number>(0);
  const [bonus, setbonus] = useState<boolean>(true);
  const [invitations, setinvitations] = useState<invitation>();
  // const [noti, setnoti] = useState<notifications | null>(null);
  let noti : notifications;

  useEffect(() => {
    const invite_handler = (notif: notifications) => {
      noti = (notif);
      console.log(JSON.stringify(notif));
      for (let i = 0; i < notif?.notifs?.length; i++){
        if (notif.notifs[i].origin === notif.name){
          handleCreateRoom();
          statusocket.socket?.off('notification');
          return ;
        }
        else if (notif.notifs[i].origin !== notif.name){
          // const invite: invitation[] = invitations;
          const inv: invitation = {
            origin: notif.notifs[i].origin,
            room: notif.notifs[i].data,
          }
          // invite.push(inv);
          setinvitations(inv);
        }
      }
      statusocket?.socket?.emit('game-visited');
    };
    statusocket.socket?.on('notification', invite_handler);
    // Subscribe to the "matchmaking" channel when the component mounts
    // SocketState.socket?.emit('subscribe', 'matchmaking');

    // Listen for "match_found" events and update the state accordingly
    const onMatchFound = (data: matchdata) => {
      if (SocketState.socket != undefined){
		    const pongprops:GamePongProps = {
		    	roomID: data.roomID,
		    	score: data.score,
		    	uid: SocketState.uid,
		    	player: data.player,
		    	socket: SocketState.socket,
		    }
		    setMatch(pongprops);
        setwaiting(0);
      }
    };
    SocketState.socket?.on('match_found', onMatchFound);

    const onRoom_created = (data: matchdata) => {
      if (SocketState.socket != undefined){
		    const pongprops:GamePongProps = {
		    	roomID: data.roomID,
		    	score: data.score,
		    	uid: SocketState.uid,
		    	player: data.player,
		    	socket: SocketState.socket,
		    }
		    setMatch(pongprops);
        setwaiting(2);
        if (noti){
          for (let i = 0; i < noti.notifs.length; i++){
            if (noti.notifs[i].target === noti.name){
              const payload: noti_payload = {
                type : 'game',
                target: noti.notifs[i].data,
                data: data.roomID,
              }// remove old notif
              statusocket.socket?.emit('send-notif', payload);
              // statusocket.socket?.emit('self-visited');
              statusocket.socket?.off('notification', invite_handler);
            }
          }
        }
      }
    };
    SocketState.socket?.on('room_created', onRoom_created);
    const onquithandler = () => {
      setMatch(null);
      setwaiting(0);
    }
    SocketState.socket?.on('quit', onquithandler);
    return () => {
      SocketState.socket?.off('quit', onquithandler);
      SocketState.socket?.off('room_created', onRoom_created);
      SocketState.socket?.off('match_found', onMatchFound);
      statusocket.socket?.off('notification', invite_handler);
    };
  }, [SocketState.socket, SocketState.uid]);

  const handleFindMatch = () => {
    setwaiting(1);
    // Emit a "find_match" event with the user's UID
    SocketState.socket?.emit('find_match', bonus);
  };

  const handleCreateRoom = () => {
    setwaiting(2);
    // Emit a "create_room" event with the user's UID
    SocketState.socket?.emit('create_room', bonus);
  };

  const handleJoinRoom = (room :string) => {
    // Emit a "join_room" event with the user's UID
    SocketState.socket?.emit('join_room', room);
  };
  const handleBonus = () => {
    setbonus(!bonus);
  }

  const join_room = () => {
    setwaiting(3);
  }

  // let invitationButtons = [];

  // for (let i = 0; i < invitations.length; i++) {
  //   const inv = invitations[i];
  //   invitationButtons.push(
  //     <button key={inv.room} onClick={() => handleJoinRoom(inv.room)}>
  //       Accept Invitation from {inv.origin}
  //     </button>
  //   );
  // }

  return (
	<div>
    <h1>Welcome to the Game</h1>
	{!match && !waiting && (
    <div>
	  <>
		<button onClick={handleFindMatch}>Find Match</button>
		<button onClick={handleCreateRoom}>Create Room</button>
		<button onClick={join_room}>Join Room</button>
    <button onClick={handleBonus}>
        {bonus ? 'bonus activated' : 'bonus desactivated'}
      </button>
	  </>
    <>
    invitations
    {invitations && <button key={invitations.room} onClick={() => handleJoinRoom(invitations.room)}>
        Accept Invitation from {invitations.origin}
      </button>}
    </>
    </div>
	)}
	{match && !waiting && <GamePong {...match} />}
  {!match && waiting === 1 && 'waiting...'}
  {match && waiting === 2 && 'waiting friend ' + match.roomID}
  {!match && waiting === 3  && <FormJoinRoom onSubmit={handleJoinRoom}/>}
  </div>
);
}

export default Matchmaking;
