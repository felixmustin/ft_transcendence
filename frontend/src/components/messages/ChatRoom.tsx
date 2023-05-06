import React, { useState, useEffect } from 'react';
import ChatBox from './ChatBox';
import SendMessage from './SendMessage';
import { Socket } from 'socket.io-client';
import { ChatRoomInterface, MessageInterface } from './types';
import Participants from './Participants';

type Props = {
  room:ChatRoomInterface;
  roomId: number;
  id: number;
  socket: Socket | undefined;
};

const ChatRoom = ({ roomId, id, socket }: Props) => {

  return (
    <div className="bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 relative w-2/3 p-3 rounded-lg flex flex-col h-full">
      <Participants roomId={roomId} id={id}/>
      <hr className="w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900" />
      <div className="flex-grow overflow-y-auto">
        <ChatBox roomId={roomId} id={id} socket={socket} />
      </div>
      <SendMessage roomId={roomId} id={id} socket={socket} />
    </div>
  );
};

export default ChatRoom;
