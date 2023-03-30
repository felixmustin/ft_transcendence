import React, { useState, useEffect } from "react";
import SocketContext from '../../context/Socket';
import GamePong, {GamePongProps, ScoreProps} from "./Pong";

type matchdata = {
	roomID: string,
	score: ScoreProps,
	player: number,
}

function Matchmaking() {
  const { SocketState, SocketDispatch } = React.useContext(SocketContext);
  const [match, setMatch] = useState<GamePongProps | null>(null);
  const [waiting, setwaiting] = useState<boolean>(false);

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
      setwaiting(false);
    }
    };
    SocketState.socket?.on('match_found', onMatchFound);

    // Unsubscribe from the "matchmaking" channel when the component unmounts
    return () => {
    //   SocketState.socket?.emit('unsubscribe', 'matchmaking');
      SocketState.socket?.off('match_found', onMatchFound);
    };
  }, [SocketState.socket]);

  const handleFindMatch = () => {
    setwaiting(true);
    // Emit a "find_match" event with the user's UID
    SocketState.socket?.emit('find_match', SocketState.uid);
  };

  const handleCreateRoom = () => {
    // Emit a "create_room" event with the user's UID
    SocketState.socket?.emit('create_room', SocketState.uid);
  };

  const handleJoinRoom = () => {
    // Emit a "join_room" event with the user's UID
    SocketState.socket?.emit('join_room', SocketState.uid);
  };

  return (
	<div>
	<h1>Matchmaking</h1>
	{!match && !waiting && (
	  <>
		<button onClick={handleFindMatch}>Find Match</button>
		<button onClick={handleCreateRoom}>Create Room</button>
		<button onClick={handleJoinRoom}>Join Room</button>
	  </>
	)}
	{match && <GamePong {...match} />}
  {!match && waiting && 'waiting...'}
  </div>
);
}

export default Matchmaking;
