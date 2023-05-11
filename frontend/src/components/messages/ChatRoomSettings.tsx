import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { ChatRoomInterface, ProfileInterface } from './types';
import SettingRoomField from './SettingRoomField';
import { useNavigate } from 'react-router-dom';

type Props = {
  room:ChatRoomInterface;
  token: string | undefined;
};

const ChatRoomSettings= ({ room, token }: Props) => {

  const [addMemberUsername, setAddMemberUsername] = useState({username:''});
  // const [addAdminUsername, setAddAdminUsername] = useState({username:''});

  const [adminList, setAdminList] = useState([]);

  const navigate = useNavigate();
  const [showActionBoxId, setShowActionBoxId] = useState(0);
  const [selectedUser, setSelectedUser] = useState<ProfileInterface>();
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [selectedAdminOptions, setSelectedAdminOptions] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      const auth = 'Bearer ' + token;
      const url = `http://localhost:3001/chatroom/admin/list`

      try {
        const res = await fetch(url, { method: 'POST', headers: { 'Authorization': auth, 'Content-Type': 'application/json' }, body: JSON.stringify({roomId: room.id}) });
        const result = await res.json();
        if (result.statusCode >=400)
          alert(result.message)
        else {
          setAdminList(result);
        }
      } catch (error) {
        console.log(error)
      }
    };
    fetchData();
  }, []);

    const deleteRoom = async () => {
     const auth = 'Bearer ' + token;
     const url = 'http://localhost:3001/chatroom/' + room?.id;
       const res = await fetch(url, { method: 'DELETE', headers: { Authorization: auth }});
       console.log('deleteRoom result:', res);
       window.location.reload(); 
   };

  const isAdminFct = (member: ProfileInterface) => {
    const isAdmin = adminList.includes(member.username);
    return isAdmin
  };

  const handleInputAddMember = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setAddMemberUsername(prevState => ({ ...prevState, [name]: value }));
  };


  const removeUserFromChatRoom = async (username: string) => {
    const auth = 'Bearer ' + token;

    await fetch('http://localhost:3001/chatroom/removeMember', {
    method: 'POST',
    headers: {
    'Authorization': auth,
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({roomId: room?.id, username: username})
    }).then(response => {
      if (response.ok) {
        alert("Member removed");
      } else {
        alert(response.statusText);
      }
    });
  }

  const handleUserClick = (e: any, user: ProfileInterface) => {
    e.preventDefault();
    if (showActionBoxId == user.id) {
      setShowActionBoxId(0);
      setSelectedOption('')
      setSelectedDuration('')
    }
    else {
      setSelectedUser(user);
      setShowActionBoxId(user.id);
      setPopupPosition({
        top: e.currentTarget.offsetTop + 100,
        left: e.currentTarget.offsetLeft
      });
    }
  };

  const handleDurationChange = (e: any) => setSelectedDuration(e.target.value);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const auth = 'Bearer ' + token;

      await fetch('http://localhost:3001/chatroom/addMember', {
      method: 'POST',
      headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({roomId: room?.id, username: addMemberUsername.username})
      }).then(response => {
        if (response.ok) {
          alert("Member added");
        } else {
          alert(response.statusText);
        }
      });
    }

    const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const auth = 'Bearer ' + token;
      let url = ''
      let body = ''

      if (selectedUser) {
        if (selectedOption == 'mute') {
          url = 'http://localhost:3001/chatroom/mute'
          body = JSON.stringify({roomId: room.id, username: selectedUser.username, duration: selectedDuration})
        }
        else if (selectedOption == 'ban') {
          url = 'http://localhost:3001/chatroom/ban'
          body = JSON.stringify({roomId: room.id, username: selectedUser.username, duration: selectedDuration})
        }
        else if (selectedOption == 'admin') {
          body = JSON.stringify({roomId: room.id, username: selectedUser.username})
          if (selectedAdminOptions == "add")
            url = 'http://localhost:3001/chatroom/addAdmin'
          else if (selectedAdminOptions == "remove")
            url = 'http://localhost:3001/chatroom/removeAdmin'
        }
        else 
          return;
      
        await fetch(url, {
            method: 'POST',
            headers: {
            'Authorization': auth,
            'Content-Type': 'application/json',
            },
            body: body
            }).then(response => {
              if (response.ok) {
                alert(response.statusText);
            } else {
              alert(response.statusText);
            }
          });
        }
      else
        return ;
    }

    return (
      <div className="flex text-center bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 relative w-2/3 p-3 rounded-lg">
        <div className="bg-violet-900 w-[1000px] rounded-lg m-5">
          <p className="text-white text-3xl font-bold m-5">{room?.name} Settings</p>
          <div className="grid grid-cols-2 items-center gap-4 p-5">
            <div className="grid grid-rows-auto gap-6">
              <div className="m-3">
                <label>Members</label>
                <div className="flex flex-row overflow-x-auto text-center whitespace-nowrap mt-2 space-x-4">
                  
                {room?.participants.map((member, index) => {
                return (
                  <span key={member.id} className={`${isAdminFct(member) ? "text-yellow-400" : "text-white"}`}>
                    <span onClick={(event) => handleUserClick(event, member)}>{member.username}</span>
                    {(showActionBoxId === member.id) && (
                      <div className="absolute" style={{ top: popupPosition.top -75, left: popupPosition.left -10 }}>
                        <select onChange={(e) => setSelectedOption(e.target.value)} className="text-white bg-black">
                          <option value="">Select an action</option>
                          <option value="mute">Mute</option>
                          <option value="ban">Ban</option>
                          <option value="admin">Admins</option>
                          <option value="remove">Remove</option>
                        </select>
                        {selectedOption === 'mute' || selectedOption === 'ban' ? (
                          <form onSubmit={handleSubmitForm} className="bg-black text-white">
                            <select onChange={handleDurationChange}>
                              <option value="">Select duration</option>
                              <option value="60">1min</option>
                              <option value="600">10min</option>
                              <option value="3600">1h</option>
                            </select>
                            <button type="submit">Confirm</button>
                          </form>
                        ) : null}
                        {selectedOption === 'admin' ? (
                          <form onSubmit={handleSubmitForm} className="text-white">
                            <button onClick={() => setSelectedAdminOptions('add')}>Add</button>
                            <button onClick={() => setSelectedAdminOptions('remove')}>Remove</button>
                          </form>
                        ) : null}
                        {selectedOption === 'remove' ? (
                          <form onSubmit={handleSubmitForm} className="text-white">
                            <button onClick={() => removeUserFromChatRoom(member.username)} >Confirm</button>
                          </form>
                        ) : null}
                      </div>
                    )}
                    {(index + 1) % 2 === 0 ? <br /> : null}
                  </span>
                );
              })}
                </div>
              </div>
              <div className="m-3 self-end">
                <form onSubmit={handleSubmit}>
                  <label className="font-bold">Add member : </label>
                  <input
                    className="bg-white rounded-lg text-black"
                    type="text"
                    name="username"
                    value={addMemberUsername.username}
                    onChange={handleInputAddMember}
                  />
                </form>
              </div>
            </div>
            <div className="self-end" >
              <SettingRoomField room={room} token={token} />
            </div>
          </div>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded my-3"
            onClick={() => deleteRoom()}
          >
            Delete room
          </button>
        </div>
      </div>
    );
   
};

export default ChatRoomSettings;