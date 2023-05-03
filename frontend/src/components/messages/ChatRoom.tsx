import React, { useState, useEffect } from 'react';
import ChatBox from './ChatBox';
import SendMessage from './SendMessage';
import { Socket } from 'socket.io-client';
import { MessageInterface } from './types';
import Participants from './Participants';

type Props = {
  roomId: number;
  id: number;
  socket: Socket | null;
};

const ChatRoom = ({ roomId, id, socket }: Props) => {

  console.log('ChatRoom:', roomId);

  const [messages, setMessages] = useState<MessageInterface[]>([]);

  return (
    <div className="bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 relative w-2/3 p-3 rounded-lg">
      <Participants roomId={roomId} id={id}/>
      <ChatBox roomId={roomId} id={id} socket={socket} />
      <SendMessage roomId={roomId} id={id} socket={socket} />
    </div>
  );
};

export default ChatRoom;
