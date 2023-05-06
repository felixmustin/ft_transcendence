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

  // useEffect(() => {
  //   const newSocket = io("http://localhost:3001/chat");
  //   setSocket(newSocket);

  //   return () => {
  //     newSocket.close();
  //   };
  // }, []);

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
    console.log('Clicked on room:', roomId);

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
        {!createRoom && <button className='m-2' onClick={createNewRoom}>Create Room</button>}
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
        />
      :
      null}
    </div>
  );
};

export default Chat;

