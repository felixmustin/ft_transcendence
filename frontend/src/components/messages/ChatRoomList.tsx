import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { ChatRoomInterface, ProfileInterface } from './types';
import { Buffer } from 'buffer';


type Props = {
    myRooms: ChatRoomInterface[];
   token: string | undefined;
};

const ChatRoomList= ({ myRooms, token }: Props) => {

    const [rooms, setRooms] = useState<ChatRoomInterface[]>([]);
    const [roomJoinId, setRoomJoinId] = useState(0);
    const [roomPassword, setRoomPassword] = useState('');
    
    // Fetch rooms
    const fetchRooms = async () => {
      const auth = 'Bearer ' + token;
      const url = 'http://localhost:3001/chatroom/all';
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
    
      const handleSubmitPassword = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setRoomPassword(value);
      };


    const handleJoinRoom = async (room: ChatRoomInterface) => {
        const auth = 'Bearer ' + token;

        if (room.mode == 'private')
            return ;
        await fetch('http://localhost:3001/chatroom/join', {
          method: 'POST',
          headers: {
          'Authorization': auth,
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({roomId: room.id, password:roomPassword})
          }).then(response => {
            if (response.ok) {
              alert("Member added");
            } else {
              alert("Problem adding member");
            }
          });
     }
  
    return (
        <div className="bg-violet-800 rounded-lg mx-1 overflow-y-auto max-h-[calc(6*5.5rem)]">
          {rooms.map((room) => {
            if (myRooms.find((myRoom) => myRoom.id === room.id))
                return;
            const img = Buffer.from(room.image.data).toString('base64')
            return (
            (room.mode == 'public' || room.mode == 'protected') ? 
            
            <div>
            <div className="flex justify-between items-center text-white bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 my-1 rounded-lg px-4 py-2" onClick={() => setRoomJoinId(room.id)}>
                <img
                    src={`data:image/png;base64,${img}`}
                    alt="User Avatar"
                    className="rounded-full w-[50px] h-[50px]"
                />
                <div className="flex flex-col mx-4 w-full">
                    <p className="text-lg font-bold">{room.name}</p>
                </div>

                <div className="flex flex-col mx-4 w-full">
                    <p className="text-lg font-bold">{room.mode}</p>
                </div>
                
            </div>
            { (roomJoinId == room.id) ?
                <div>
                     <div className="flex flex-col mx-4 w-full" onClick={() => handleJoinRoom(room)}>
                        Join
                    </div>
                    <div className="flex flex-col mx-4 w-full" onClick={() => setRoomJoinId(0)} >
                        Dismiss
                    </div>
                    {(room.mode == 'protected') ?
                    <div className="flex flex-col mx-4 w-full">
                        <label htmlFor="password">Room password:</label>
                        <input type="text" id="password" name="password" className='bg-white text-black rounded-lg' onChange={handleSubmitPassword}/>
                    </div>
                    :
                    null
                    }
                </div>
                :
                null
                }
            </div>
            :
            null
            );
            })}
        </div>
    );
};

export default ChatRoomList;
