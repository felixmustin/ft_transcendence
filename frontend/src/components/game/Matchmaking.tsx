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
  const [bonus, setbonus] = useState<boolean>(true);

  useEffect(() => {
    // Subscribe to the "matchmaking" channel when the component mounts
    // SocketState.socket?.emit('subscribe', 'matchmaking');

    // Listen for "match_found" events and update the state accordingly
    const onMatchFound = (data: matchdata) => {
      if (SocketState.socket != undefined){
        console.log("uid : " + SocketState.uid);
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
    const onquithandler = () => {
      setMatch(null);
      setwaiting(0);
    }
    SocketState.socket?.on('quit', onquithandler);
    return () => {
      SocketState.socket?.off('quit', onquithandler);
      SocketState.socket?.off('room_created', onRoom_created);
      SocketState.socket?.off('match_found', onMatchFound);
    };
  }, [SocketState.socket, SocketState.uid]);

  const handleFindMatch = () => {
    setwaiting(1);
    // Emit a "find_match" event with the user's UID
    SocketState.socket?.emit('find_match', bonus);
  };

  const handleCreateRoom = () => {
    setwaiting(2);
    console.log('create room');
    // Emit a "create_room" event with the user's UID
    SocketState.socket?.emit('create_room', bonus);
  };

  const handleJoinRoom = (room :string) => {
    console.log('join room triggered with ' + room);
    // Emit a "join_room" event with the user's UID
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
      <div className="space-y-4">
        <button className='w-[200px] m-2 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' onClick={handleFindMatch}>Find Match</button>
        <button className='w-[200px] m-2 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' onClick={handleCreateRoom}>Create Room</button>
        <button className='w-[200px] m-2 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' onClick={join_room}>Join Room</button>
        <button className='w-[200px] m-2 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' onClick={handleBonus}>
          {bonus ? 'bonus activated' : 'bonus desactivated'}
        </button>
      </div>
      )}
      {match && !waiting && <GamePong {...match} />}
      {!match && waiting === 1 && <p className='text-white'>waiting...</p>}
      {match && waiting === 2 && <p className='text-white'>waiting friend {match.roomID}</p>}
      {!match && waiting === 3  && <FormJoinRoom onSubmit={handleJoinRoom}/>}
    </div>
  );
}

export default Matchmaking;
