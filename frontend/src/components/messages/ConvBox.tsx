import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { ChatRoomInterface, MessageInterface, ProfileInterface } from './types';
import login from '../../assets/login.jpg'

interface UpdateLastMessageData {
  roomId: number;
  lastMessage: MessageInterface;
}

interface UserData {
  id: number;
  username: string;
}

type Props = {
  room: ChatRoomInterface;
  onBoxClick: (roomId: number) => void;
  socket: Socket | undefined;
  token: string | undefined;
  id: number;
};

const ConvBox = ({ room, onBoxClick, socket, token, id }: Props) => {
  const [lastMessage, setLastMessage] = useState<MessageInterface | null>(null);
  const [users, setUsers] = useState<number[]>([]);
  const [usersnames, setUsernames] = useState<string[]>([]);
  const [groupName, setGroupName] = useState<string>('Group');

  const handleClick = () => {
    onBoxClick(room.id);
  };

  const fetchLastMessage = async () => {
    const auth = 'Bearer ' + token;
    const url = 'http://localhost:3001/chatroom/last_message/' + room.id;
    try {
      const res = await fetch(url, { method: 'GET', headers: { Authorization: auth } });
      const result = await res.json();
      setLastMessage(result);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchUsersId = async () => {
    const auth = 'Bearer ' + token;
    const url = `http://localhost:3001/chatroom/${room.id}/all/users/`;
    try {
      const res = await fetch(url, { method: 'GET', headers: { Authorization: auth } });
      const result = await res.json();
      console.log('fetchUsersId result:', result);
      setUsers(result);
      console.log('Users state:', users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUsernames = async () => {
    const auth = 'Bearer ' + token;
    const url = 'http://localhost:3001/user/profiles/';
    try {
      const res = await fetch(url, { method: 'POST', headers: { Authorization: auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ users: users }) });
      const result = await res.json();
      console.log('fetchUsersnames result:', result);
      setUsernames(result);
      if (room.name) setGroupName(room.name);
      else if (users.length === 2) {
        const index = users.indexOf(id);
        if (index === 0) setGroupName(result[1]);
        else setGroupName(result[0]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteRoom = async () => {
    const auth = 'Bearer ' + token;
    const url = 'http://localhost:3001/chatroom/' + room.id;
    try {
      const res = await fetch(url, { method: 'DELETE', headers: { Authorization: auth } });
      const result = await res.json();
      console.log('deleteRoom result:', result);
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      await fetchLastMessage();
      await fetchUsersId();
    };

    fetchData();
  }, [room.id, token]);

  useEffect(() => {
    const fetchNamesAndSetGroupName = async () => {
      await fetchUsernames();
    };

    if (users.length > 0) {
    console.log('Users state before fetching usernames:', users);
    fetchNamesAndSetGroupName();
  }
  }, [users]);

  useEffect(() => {
    if (!socket) return;
  
    const handleUpdateLastMessage = ({ roomId, lastMessage }: UpdateLastMessageData) => {
      if (roomId === room.id) {
        setLastMessage(lastMessage);
      }
    };
  
    socket.on("update_last_message", handleUpdateLastMessage);
  
    return () => {
      socket.off("update_last_message", handleUpdateLastMessage);
    };
  }, [socket, room.id]);

  return (
    <div
      className="flex items-center justify-between bg-gradient-to-tl from-violet-900 via-black to-black my-2 p-2 rounded-lg"
      onClick={handleClick}
    >
      <div className="flex items-center">
        <img src={login} className="rounded-full h-10 w-10 mr-2" />
        <div className="justify-center text-center text-white pl-2">{groupName}</div>
      </div>
      <div className="flex-grow text-center text-white">{lastMessage?.content}</div>
      <button
        onClick={deleteRoom}
        className="bg-red-500 text-black font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
      >
        X
      </button>
    </div>
  );
};

export default ConvBox;
