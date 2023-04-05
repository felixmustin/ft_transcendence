import React from 'react'
import Message from './Message'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from '../utils/Loading'
import Error from '../utils/Error'
import { MessageInterface } from './types';
import { getSessionsToken } from '../../sessionsUtils';

type Props = {
  roomId?: number;
}

const ChatBox = (props: Props) => {

  // Error management
  const [error, setError] = useState(null);
  // Loading management
  const [isLoaded, setIsLoaded] = useState(false);
  // User data retrieved from the API
  const [mess, setMess] = useState<MessageInterface[]>([]);

  const navigate = useNavigate();
  const token = getSessionsToken()
  const auth = 'Bearer ' + token.access_token;

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:3001/chatroom/${props.roomId}/messages`

      try {
        const res = await fetch(url, { method: 'GET', headers: { 'Authorization': auth } });
        const result = await res.json();
        setIsLoaded(true);
        setMess(result);
      } catch (error) {
        setIsLoaded(true);
        setError(error);
      }
    };

    if (!token) {
      navigate('/');
    } else {
      fetchData();
    }
  }, []);

  return (
    <div className='pb-44 pt-20 containerWrap'>
      {mess.map((message) => (
        <Message key={ message.id } message={message} currentUserId={2}/>
      ))}
    </div>
  )
}

export default ChatBox