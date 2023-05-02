import React, { useEffect } from 'react';
import ConvBox from './ConvBox';
import { ChatRoomInterface, MessageInterface } from './types';
import { Socket } from 'socket.io-client';

type Props = {
  rooms: ChatRoomInterface[];
  onRoomSelect: (roomId: number) => void;
  socket: Socket | null;
  token: string | undefined;
  id: number;
}

const ConvList = ({ rooms, onRoomSelect, socket, token, id }: Props) => {

  return (
    <div className="bg-violet-800 rounded-lg mx-1">
      {rooms.map((room) => (
        <ConvBox key={room.id} room={room} onBoxClick={onRoomSelect} socket={socket} token={token} id={id}/>
      ))}
    </div>
  );
};

export default ConvList;
