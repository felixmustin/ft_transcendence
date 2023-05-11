import React, { useState, useEffect } from "react";
import SocketContext, { ISocketContextState } from '../../context/Socket';
import GamePong, {GamePongProps, ScoreProps} from "./Pong";
import FormJoinRoom from "./FormJoinRoom";
import { noti_payload, notifications } from "../../App";
import { Invitebuttons } from "./InvitationButtons";

export type statusgame = {
	status: number,
	room: string,
}

type matchdata = {
	roomID: string,
	score: ScoreProps,
	player: number,
}
type props = {
  statusocket: ISocketContextState,
}
export type invitation = {
  origin: string,
  room: string,
}

function Matchmaking(props: props) {
  const { statusocket } = props;
  const { SocketState, SocketDispatch } = React.useContext(SocketContext);
  const [match, setMatch] = useState<GamePongProps | null>(null);
  const [waiting, setwaiting] = useState<number>(0);
  const [bonus, setbonus] = useState<boolean>(true);
  const [invitations, setinvitations] = useState<invitation[]>([]);
  // const [noti, setnoti] = useState<notifications | null>(null);
  let noti : notifications;

  useEffect(() => {
    const invite_handler = (notif: notifications) => {
      noti = (notif);
      // console.log(JSON.stringify(notif));
      for (let i = 0; i < notif?.notifs?.length; i++){
        if (notif.notifs[i].origin === notif.name && notif.notifs[i].type === 'game'){
          handleCreateRoom();
          statusocket.socket?.off('notification');
          return ;
        }
        else if (notif.notifs[i].origin !== notif.name && notif.notifs[i].type === 'game'){
          const invite: invitation[] = invitations;
          const inv: invitation = {
            origin: notif.notifs[i].origin,
            room: notif.notifs[i].data,
          }
          if (!invite.some(item => item.origin === inv.origin && item.room === inv.room)){
            invite.push(inv);
            setinvitations([...invite]);
            console.log('invites ' + invitations);
            statusocket?.socket?.emit('game-visited');
          }
        }
      }
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
        const payload: statusgame = {
          status: 2,
          room: data.roomID,
        }
        statusocket.socket?.emit('update_status', payload);
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
              statusocket.socket?.on('notification', invite_handler);
            }
          }
        }
      }
    };
    SocketState.socket?.on('room_created', onRoom_created);
    const onquithandler = () => {
      setMatch(null);
      setwaiting(0);
      // const payload: statusgame = {
      //   status: 1,
      //   room: '',
      // }
      statusocket.socket?.emit('status quit game');
    }
    SocketState.socket?.on('quit', onquithandler);
    return () => {
      SocketState.socket?.off('quit', onquithandler);
      SocketState.socket?.off('room_created', onRoom_created);
      SocketState.socket?.off('match_found', onMatchFound);
      statusocket.socket?.off('notification', invite_handler);
      // const payload: statusgame = {
      //   status: 1,
      //   room: '',
      // }
      // statusocket.socket?.emit('update_status', payload);
      statusocket.socket?.emit('status quit game');
    };
  }, [SocketState.socket, SocketState.uid]);

  // useEffect (() => {
  //   statusocket.socket?.emit('game-visited');
  // },[invitations])
  const handleFindMatch = () => {
    setwaiting(1);
    // Emit a "find_match" event with the user's UID
    SocketState.socket?.emit('find_match', bonus);
  };

  const handleCreateRoom = () => {
    setwaiting(2);
    // Emit a "create_room" event with the user's UID
    console.log('emiting create room');
    SocketState.socket?.emit('create_room', bonus);
  };

  const handleJoinRoom = (room :string) => {
    // Emit a "join_room" event with the user's UID
    console.log('joining room ' + room);
    setinvitations([]);
    SocketState.socket?.emit('join_room', room);
  };
  const handleBonus = () => {
    setbonus(!bonus);
  }

  const join_room = () => {
    setwaiting(3);
  }

  return (
    <div className="bg-violet-700 flex flex-col justify-center items-center m-5 p-5 rounded-lg">
      <div className="text-3xl font-bold mb-10 text-white"><p>Welcome to the Game</p></div>
      {!match && !waiting && (
    <div>
      <div className="space-y-4">
        <button className='w-[200px] m-2 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' onClick={handleFindMatch}>Find Match</button>
        <button className='w-[200px] m-2 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' onClick={handleCreateRoom}>Create Room</button>
        <button className='w-[200px] m-2 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' onClick={join_room}>Join Room</button>
        <button className='w-[200px] m-2 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' onClick={handleBonus}>
          {bonus ? 'bonus activated' : 'bonus desactivated'}
        </button>
      <>
      <Invitebuttons invite={invitations} handleJoinRoom={handleJoinRoom}/>
    </>
    </div></div>
      )}
      {match && !waiting && <GamePong {...match} />}
      {!match && waiting === 1 && <p className='text-white'>waiting...</p>}
      {match && waiting === 2 && <p className='text-white'>waiting friend {match.roomID}</p>}
      {!match && waiting === 3  && <FormJoinRoom onSubmit={handleJoinRoom}/>}
    </div>
  );
}

export default Matchmaking;
