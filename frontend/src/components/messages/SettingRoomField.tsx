import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import { ChatRoomInterface } from './types';
import { Buffer } from 'buffer';

type Props = {
  room:ChatRoomInterface;
  token: string | undefined;
}


const SettingRoomField = (props: Props) => {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);
    const [room, setRoom] = useState<ChatRoomInterface>(props.room);
    const [updatedRoom, setUpdatedRoom] = useState(null);

    const [newRoomName, setNewRoomName] = useState('');
    const [editRoomName, setEditRoomName] = useState(false);
    const [newRoomMode, setNewRoomMode] = useState('');
    const [editRoomMode, setEditRoomMode] = useState(false);
    const [newRoomModePassword, setNewRoomModePassword] = useState('');


    useEffect(() => {
      if (updatedRoom) {
          setRoom(updatedRoom);
          setUpdatedRoom(null); // reset updatedUser state
      }
  }, [updatedRoom])

   function handleAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('roomId', room.id.toString());
      formData.append('avatar', file);
      if (props.token) {
        const auth = 'Bearer ' + props.token
        fetch("http://localhost:3001/chatroom/setImage", {
          method: "POST",
          headers: {
            Authorization: auth,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            setUpdatedRoom(data);
          })
          .catch((error) => {
            console.error("Failed to upload image:", error);
          });
        }
        }
    }

    function handleUpdateRoomName() {
      if (!newRoomName)
          return;
      const auth = 'Bearer ' + props.token
      fetch('http://localhost:3001/chatroom/update/name', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': auth
          },
          body: JSON.stringify({roomId: room.id, roomName: newRoomName})
      })
      .then(res => res.json())
      .then((result) => {
          if (result.statusCode >= 400) {
            alert(result.message)
          }
          else {
            setRoom(prevRoom => ({...prevRoom, name: newRoomName}));
            setEditRoomName(false);
          }
      })
      
    }

    function handleUpdateRoomMode() {

      if (!newRoomMode)
          return;
      if (newRoomMode === 'protected' && newRoomModePassword.trim() === '') {
        alert('Please enter a password for the protected mode.');
        return;
      }
      
      const auth = 'Bearer ' + props.token
      fetch('http://localhost:3001/chatroom/update/mode', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': auth
          },
          body: JSON.stringify({roomId: room.id, roomMode: newRoomMode, roomPassword: newRoomModePassword})
      })
      .then(res => res.json())
      .then((result) => {
        if (result.statusCode >= 400) {
          alert(result.message)
        }
        else {
          setRoom(prevRoom => ({...prevRoom, mode: newRoomMode}));
          setEditRoomMode(false);
          }
      })
    }

    const img = Buffer.from(room.image.data).toString('base64')
    if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
          return (
              <div className='flex flex-col space-y-4'>
                 <div className='flex flex-row items-center mx-auto'>

                 <div> 
                    <p className='relative'>
                        {room.image && (
                        <img
                            src={`data:image/png;base64,${img}`}
                            alt="User Avatar"
                            className="rounded-full w-[60px] h-[60px]"
                        />
                        )}
                    </p>
                </div>

                    <label
                      htmlFor='avatar'
                      className="relative inset-0 cursor-pointer">
                      {room.image ? 'Change Avatar' : 'Upload Avatar'}
                    </label>
                    <input
                      type='file'
                      name='avatar'
                      id='avatar'
                      accept='.png'
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div className='flex justify-between items-start'>
                    <h1 className="flex items-center"
                        onBlur={() => setEditRoomName(false)} > 
                    <span>Room name : </span>
                      {editRoomName ?
                     
                        <input type="text" 
                          value={newRoomName} 
                          onChange={e => setNewRoomName(e.target.value)} 
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                                handleUpdateRoomName();
                            }
                          }}
                          autoFocus
                        /> :
                        <>
                          <span className="ml-2">{room.name}</span>
                          <FaPen 
                            className="ml-2 cursor-pointer"
                            onClick={() => setEditRoomName(true)}
                          />
                        </>
                      }
                    </h1>
                  </div>
                  
                  <div className='flex justify-between items-start'>
                    <h1 className="flex items-center"
                        /* onBlur={() => setEditRoomMode(false)} */ > 
                    <span>Room mode : </span>
                      {editRoomMode ?
                        <div>
                          <select
                            value={newRoomMode}
                            onChange={e => setNewRoomMode(e.target.value)}
                            /* autoFocus */>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="protected">Protected</option>
                          </select>
                          {newRoomMode === 'protected' &&
                            <input type="password"
                              value={newRoomModePassword}
                              onChange={e => setNewRoomModePassword(e.target.value)}
                            />
                          }
                          <button onClick={handleUpdateRoomMode}>Update</button>
                       </div>
                        :
                        <>
                          <span className="ml-2">{room.mode}</span>
                          <FaPen 
                            className="ml-2 cursor-pointer"
                            onClick={() => setEditRoomMode(true)}
                          />
                        </>
                      }
                    </h1>
                  </div>

                  {/* { (roomMode === 'protected') &&
        <div>
          <label htmlFor="password">Room password:</label>
          <input type="text" id="password" name="password" onChange={handlePassChange}/>
        </div>
        } */}


              </div>        
        )
    }
}

export default SettingRoomField