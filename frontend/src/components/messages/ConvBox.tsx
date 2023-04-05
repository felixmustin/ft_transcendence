import React from 'react'
import loginImg from '../../assets/login.jpg'
import { ChatRoomInterface } from './types';
import { MessageInterface } from './types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSessionsToken } from '../../sessionsUtils';


type Props = {
  room: ChatRoomInterface;
  onBoxClick: (roomId: number) => void;
};

const ConvBox = ({ room, onBoxClick }: Props) => {

  const read = true;
  const readClass = read ? 'bg-green-300' : 'bg-red-400'

  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [last_message, setLastMessage] = useState<MessageInterface>();
  const navigate = useNavigate();
  const token = getSessionsToken()
  const auth = 'Bearer ' + token.access_token;

  const handleClick = () => {
    onBoxClick(room.id);
  };

  useEffect(() => {
    const fetchLastMessage = async () => {
      const url = `http://localhost:3001/chatroom/last_message/${room.id}`;
      try {
        const res = await fetch(url, { method: 'GET', headers: { 'Authorization': auth } });
        const result = await res.json();
        setIsLoaded(true);
        setLastMessage(result);
      }
      catch (error) {
        setIsLoaded(true);
        setError(error);
      }
    };
    if (!token) {
      navigate('/');
    } else {
      fetchLastMessage();
    }
  }, []);


  return (
    <div className={`flex ${readClass} my-1 rounded-lg`} onClick={handleClick}>
      <div className='w-1/3'><img src={loginImg} className='rounded-full h-10 w-10'/></div>
      <div className='w-2/3 text-center text-black'>{last_message?.content}</div>
    </div>
  )
}

export default ConvBox