import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { ChatRoomInterface, MessageInterface, ProfileInterface } from './types';
import { IoSettingsSharp } from 'react-icons/io5';
import { Buffer } from 'buffer';



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
  onBoxClick: (roomId: number, settingBool: boolean) => void;
  socket: Socket | undefined;
  token: string | undefined;
  id: number;
};

const ConvBox = ({ room, onBoxClick, socket, token, id }: Props) => {
  const [lastMessage, setLastMessage] = useState<MessageInterface | null>(null);
  const [users, setUsers] = useState<number[]>([]);
  const [usersnames, setUsernames] = useState<string[]>([]);
  const [groupName, setGroupName] = useState<string>(room.name!);

  const handleClickConv = () => {
    onBoxClick(room.id, false);
  };

  const handleClickSetting = () => {
    onBoxClick(room.id, true);
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
      setUsers(result);
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

  // const deleteRoom = async () => {
  //   const auth = 'Bearer ' + token;
  //   const url = 'http://localhost:3001/chatroom/' + room.id;
  //   try {
  //     const res = await fetch(url, { method: 'DELETE', headers: { Authorization: auth } });
  //     const result = await res.json();
  //     console.log('deleteRoom result:', result);
  //   } catch (error) {
  //     console.error('Error deleting room:', error);
  //   }
  // };

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

  const img = Buffer.from(room.image.data).toString('base64')
  return  (
    <div className="flex justify-between items-center bg-green-300 my-1 rounded-lg px-4 py-2">
    <div className="flex items-center w-2/3" onClick={handleClickConv}>

    <div> 
        <p className='relative'>
            {room.image && (
            <img
                src={`data:image/png;base64,${img}`}
                alt="User Avatar"
                className="rounded-full w-[50px] h-[50px]"
            />
            )}
        </p>
    </div>

      <div className="text-black">
      <div className="justify-center text-center text-lg font-bold">{groupName}</div>
      <div className="w-2/3 text-center text-sm">{lastMessage?.content}</div>
      </div>

    </div>
    <div>
    <IoSettingsSharp className="justify-center text-center cursor-pointer" size="1.5em"
                          onClick={() => handleClickSetting()} />
    </div>
    </div>
  );
};

export default ConvBox;
