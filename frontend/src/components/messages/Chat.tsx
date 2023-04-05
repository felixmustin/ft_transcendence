import React, { useEffect } from 'react'
import ChatRoom from './ChatRoom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConvBox from './ConvBox';
import { ChatRoomInterface } from './types';
import { getSessionsToken } from '../../sessionsUtils';


type Props = {}

const Chat = (props: Props) => {

  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [id, setId] = useState(0);
  const [rooms, setRooms] = useState<ChatRoomInterface[]>([]);

  const navigate = useNavigate();
  const token = getSessionsToken()
  const auth = 'Bearer ' + token.access_token;

  useEffect(() => {
    const fetchRooms = async () => {
      const url = 'http://localhost:3001/chatroom/all_my_rooms';
      try {
        const res = await fetch(url, { method: 'GET', headers: { 'Authorization': auth } });
        const result = await res.json();
        setIsLoaded(true);
        setRooms(result);
      }
      catch (error) {
        setIsLoaded(true);
        setError(error);
      }
    };
    if (!token) {
        navigate('/');
      } else {
        fetchRooms();
      }
    }, []);


  const onConvBoxClick = (roomId: number) => {
    setId(roomId);
  };

  return (
    <div className='flex bg-violet-700 rounded-lg p-2 m-2'>
      <ChatRoom key={id} roomId={id} />
      <div className='bg-violet-800 w-1/3 rounded-lg mx-1'>
        {
          rooms.map((room) => (
            <ConvBox key={room.id} room={room} onBoxClick={onConvBoxClick} />
          ))
        }
      </div>
    </div>
  )
}

export default Chat