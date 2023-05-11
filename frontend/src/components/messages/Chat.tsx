import React, { useEffect, useState } from 'react';
import ChatRoom from './ChatRoom';
import ConvList from './ConvList';
import { ChatRoomInterface, MessageInterface } from './types';
import jwtDecode from 'jwt-decode';
import { Socket, io } from 'socket.io-client';
import CreateRoom from './CreateRoom';
import ChatRoomSettings from './ChatRoomSettings';
import SocketContext, { ISocketContextState } from '../../context/Socket';
import ChatRoomList from './ChatRoomList';
import { notifications } from '../../App';

interface DecodedToken {
  id: number;
}

type Props = {
  accessToken: string;
  statusocket: ISocketContextState;
};

const Chat = (props: Props) => {
  // Socket Connection
  const { SocketState, SocketDispatch } = React.useContext(SocketContext);
  const { statusocket } = props;
  const socket = SocketState.socket;

  // Rooms
  const [rooms, setRooms] = useState<ChatRoomInterface[]>([]);
  const [createRoom, setCreateRoom] = useState<boolean>(false);
  // Selected room
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedRoomIdSettings, setSelectedRoomIdSettings] = useState(false);

  const [displayAllRooms, setDisplayAllRooms] = useState(false);


  // Get user id from token
  const userId = props.accessToken
    ? (jwtDecode(props.accessToken) as DecodedToken).id
    : 0;

  // Fetch rooms
  const fetchRooms = async () => {
    const auth = 'Bearer ' + props.accessToken;
    const url = 'http://localhost:3001/chatroom/all_my_rooms';
    try {
      const res = await fetch(url, { method: 'GET', headers: { Authorization: auth } });
      const result = await res.json();
      setRooms(result);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Listen for new_chatroom event
  useEffect(() => {
    if (!socket) return;

    const handleNewChatroom = () => {
      fetchRooms();
    };

    const notif_handler = (notif: notifications) => {
      for (let i = 0; i < notif.notifs?.length; i++){
        if (!selectedRoomId && notif.notifs[i].type === 'message'){
          onConvBoxClick(Number(notif.notifs[i].data), false);
          break ;
        }
      }
      statusocket.socket?.emit('message-visited');
    }
    statusocket.socket?.on('notification', notif_handler);

    socket.on('new_chatroom', handleNewChatroom);

    return () => {
      socket.off('new_chatroom', handleNewChatroom);
      statusocket.socket?.off('notification', notif_handler);
    };
  }, [socket]);

  // Handle click on a conversation box
  const onConvBoxClick = (roomId: number, settingBool: boolean) => {
    setDisplayAllRooms(false)
    setSelectedRoomId(roomId);
    setSelectedRoomIdSettings(settingBool);
  };

  // Create new room
  const createNewRoom = () => {
    setCreateRoom(true);
  }

  const displayRoomList = () => {
    if (displayAllRooms)
      setDisplayAllRooms(false)
    else
      setDisplayAllRooms(true)

  }

  return (
    <div className="flex bg-violet-700 rounded-lg p-2 m-2">
      <div className="bg-violet-800 w-1/3 rounded-lg mx-1">
        {!createRoom && <button className="bg-gradient-to-tl from-violet-900 via-black to-black text-white font-xl font-bold rounded m-2 p-2 hover:bg-black" onClick={createNewRoom}>Create Room</button>}
        {createRoom && <CreateRoom token={props.accessToken} id={userId} setCreateRoom={setCreateRoom} />}
        <button className="bg-gradient-to-tl from-violet-900 via-black to-black text-white font-xl font-bold rounded m-2 p-2 hover:bg-black" onClick={displayRoomList}>Find Room</button>
        <ConvList
          rooms={rooms}
          onRoomSelect={onConvBoxClick}
          socket={socket}
          token={props.accessToken}
          id = {userId}
        />
      </div>
      {displayAllRooms ? 
        <ChatRoomList 
        key={selectedRoomId}
        myRooms={rooms}
        token={props.accessToken}
        />
      :
      (selectedRoomId && 
        selectedRoomIdSettings ? (
          <ChatRoomSettings
          key={selectedRoomId}
          room={rooms.find((room) => room.id === selectedRoomId)}
          token={props.accessToken}
        />
      ) 
      : selectedRoomId ?
      <ChatRoom
          key={selectedRoomId}
          room={rooms.find((room) => room.id === selectedRoomId)}
          roomId={selectedRoomId}
          socket={socket}
          token={props.accessToken}
          statusocket={statusocket}
        />
      :
      null)}
    </div>
  );
};

export default Chat;

