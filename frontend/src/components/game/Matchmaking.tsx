import React, { useState, useEffect } from "react";
import SocketContext from '../../context/Socket';
import GamePong, {GamePongProps, ScoreProps} from "./Pong";
import FormJoinRoom from "./FormJoinRoom";

type matchdata = {
	roomID: string,
	score: ScoreProps,
	player: number,
}

function Matchmaking() {
  const { SocketState, SocketDispatch } = React.useContext(SocketContext);
  const [match, setMatch] = useState<GamePongProps | null>(null);
  const [waiting, setwaiting] = useState<number>(0);

  useEffect(() => {
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
      console.log('data received');
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
      }
    };
    SocketState.socket?.on('room_created', onRoom_created);
    // Unsubscribe from the "matchmaking" channel when the component unmounts
    return () => {
    //   SocketState.socket?.emit('unsubscribe', 'matchmaking');
      SocketState.socket?.off('room_created', onRoom_created);
      SocketState.socket?.off('match_found', onMatchFound);
    };
  }, [SocketState.socket]);

  const handleFindMatch = () => {
    setwaiting(1);
    // Emit a "find_match" event with the user's UID
    SocketState.socket?.emit('find_match', SocketState.uid);
  };

  const handleCreateRoom = () => {
    setwaiting(2);
    console.log('create room');
    // Emit a "create_room" event with the user's UID
    SocketState.socket?.emit('create_room', SocketState.uid);
  };

  const handleJoinRoom = (room :string) => {
    console.log('join room triggered with ' + room);
    // Emit a "join_room" event with the user's UID
    SocketState.socket?.emit('join_room', room);
  };

  const join_room = () => {
    setwaiting(3);
  }

  return (
	<div>
	<h1>Matchmaking</h1>
	{!match && !waiting && (
	  <>
		<button onClick={handleFindMatch}>Find Match</button>
		<button onClick={handleCreateRoom}>Create Room</button>
		<button onClick={join_room}>Join Room</button>
	  </>
	)}
	{match && !waiting && <GamePong {...match} />}
  {!match && waiting === 1 && 'waiting...'}
  {match && waiting === 2 && 'waiting friend ' + match.roomID}
  {!match && waiting === 3  && <FormJoinRoom onSubmit={handleJoinRoom}/>}
  </div>
);
}

export default Matchmaking;