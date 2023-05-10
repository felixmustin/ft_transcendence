import React, { useEffect, useState } from 'react';
import ChatRoom from './ChatRoom';
import ConvList from './ConvList';
import { ChatRoomInterface, MessageInterface } from './types';
import jwtDecode from 'jwt-decode';
import { Socket, io } from 'socket.io-client';
import CreateRoom from './CreateRoom';
import ChatRoomSettings from './ChatRoomSettings';
import SocketContext from '../../context/Socket';

interface DecodedToken {
  id: number;
}

type Props = {
  accessToken: string | undefined;
};

const Chat = (props: Props) => {
  // Socket Connection
  const { SocketState, SocketDispatch } = React.useContext(SocketContext);
  const socket = SocketState.socket;

  // Rooms
  const [rooms, setRooms] = useState<ChatRoomInterface[]>([]);
  const [createRoom, setCreateRoom] = useState<boolean>(false);
  // Selected room
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedRoomIdSettings, setSelectedRoomIdSettings] = useState(false);


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

    socket.on('new_chatroom', handleNewChatroom);

    return () => {
      socket.off('new_chatroom', handleNewChatroom);
    };
  }, [socket]);

  // Handle click on a conversation box
  const onConvBoxClick = (roomId: number, settingBool: boolean) => {

    setSelectedRoomId(roomId);
    setSelectedRoomIdSettings(settingBool);
  };

  // Create new room
  const createNewRoom = () => {
    setCreateRoom(true);
  }

  return (
    <div className="flex bg-violet-700 rounded-lg p-2 m-2">
      <div className="bg-violet-800 w-1/3 rounded-lg mx-1">
        {!createRoom && <button className="bg-gradient-to-tl from-violet-900 via-black to-black text-white font-xl font-bold rounded m-2 p-2 hover:bg-black" onClick={createNewRoom}>Create Room</button>}
        {createRoom && <CreateRoom token={props.accessToken} id={userId} setCreateRoom={setCreateRoom} />}
        
        <ConvList
          rooms={rooms}
          onRoomSelect={onConvBoxClick}
          socket={socket}
          token={props.accessToken}
          id = {userId}
        />
      </div>
      {selectedRoomId && 
        selectedRoomIdSettings ? (
          <ChatRoomSettings
          key={selectedRoomId}
          room={rooms.find((room) => room.id === selectedRoomId)}
          id={userId}
          socket={socket}
          token={props.accessToken}
        />
      ) 
      : selectedRoomId ?
      <ChatRoom
          key={selectedRoomId}
          room={rooms.find((room) => room.id === selectedRoomId)}
          roomId={selectedRoomId}
          id={userId}
          socket={socket}
          token={props.accessToken}
        />
      :
      null}
    </div>
  );
};

export default Chat;

