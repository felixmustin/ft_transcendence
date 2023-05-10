import React, { useState } from 'react';
import { Socket } from 'socket.io-client';

type Props = {
  roomId: number;
  socket: Socket | undefined;
  profileId: number;
};

const SendMessage = ({ roomId, socket, profileId }: Props) => {
  const [content, setContent] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!content) return;

    if (socket) {
      socket.emit('send_message', { chatroomId: roomId, senderId: profileId, content })
      socket.on("is_muted", setIsMuted);
    }
  
    setContent('');
  };
  

  return (
  <div>
    <div>
   {isMuted ? 
    <div>You are muted from this conv</div>
    : null
    }
    </div>
    <div className='h-10 mt-auto'>
      <form className='containerWrap flex' onSubmit={handleSubmit}>
        <input
          className='rounded-lg bg-gray-600 focus:border-blue-500 focus:bg-gray-800 focus:outline-none w-5/6 h-10 px-2'
          type='text'
          placeholder='Send a message...'
          value={content}
          onChange={handleInputChange}
        />
        <button
          className='bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 w-1/6 h-10 px-3 rounded-lg mx-2'
          type='submit'
        >
          Send
        </button>
      </form>
    </div>
  </div>
  );
};

export default SendMessage;
