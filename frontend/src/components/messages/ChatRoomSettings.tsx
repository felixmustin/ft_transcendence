import React, { useState, useEffect } from 'react';
import ChatBox from './ChatBox';
import SendMessage from './SendMessage';
import { Socket } from 'socket.io-client';
import { ChatRoomInterface, MessageInterface } from './types';
import Participants from './Participants';
import SettingRoomField from './SettingRoomField';

type Props = {
  room:ChatRoomInterface;
  id: number;
  socket: Socket | null;
  token: string | undefined;
};

const ChatRoomSettings= ({ room, id, socket,token }: Props) => {

  const [addMemberUsername, setAddMemberUsername] = useState({username:''});
  const [addAdminUsername, setAddAdminUsername] = useState({username:''});

  const [adminList, setAdminList] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const auth = 'Bearer ' + token;
      const url = `http://localhost:3001/chatroom/admin/list`

      try {
        const res = await fetch(url, { method: 'GET', headers: { 'Authorization': auth } });
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

    // const deleteRoom = async () => {
  //   const auth = 'Bearer ' + token;
  //   const url = 'http://localhost:3001/chatroom/' + room.id;
  //   try {
  //     const res = await fetch(url, { method: 'DELETE', headers: { Authorization: auth } });
  //     const result = await res.json();
  //   } catch (error) {
  //     console.error('Error deleting room:', error);
  //   }
  // };


  const handleInputAddMember = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setAddMemberUsername(prevState => ({ ...prevState, [name]: value }));
  };

  const handleInputAddAdmin = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setAddAdminUsername(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const auth = 'Bearer ' + token;

      await fetch('http://localhost:3001/chatroom/addMember', {
      method: 'POST',
      headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({roomId: room.id, username: addMemberUsername.username})
      }).then(response => {
        if (response.ok) {
          alert("Member added");
        } else {
          alert("Problem adding member");
        }
      });
  
    }

    const handleSubmitAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const auth = 'Bearer ' + token;

      for (const participant of room.participants) {
        if (addAdminUsername.username == participant.username) {
          await fetch('http://localhost:3001/chatroom/addAdmin', {
          method: 'POST',
          headers: {
          'Authorization': auth,
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({roomId: room.id, username: addAdminUsername.username})
          }).then(response => {
            if (response.ok) {
              alert("Member added as admin");
            } else {
              alert("Problem adding member as admin");
            }
          });
        }
      }
    }

  return (
    <div className="bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 relative w-2/3 p-3 rounded-lg">

    <div className="flex justify-evenly">
        <div className='bg-violet-900 w-[1000px] rounded-lg m-5'>
          <div className='text-center text-white text-2xl p-3 m-2'>
            <h2>{room.name} Settings</h2>
          </div>
          <div className='grid grid-cols-2 items-center p-5'>
            <div>
                <div className='underline'>Members</div>
                {/* <Participants roomId={room.id} id={id} isSettings={true}/> */}
                <div style={{ fontSize: '0.9rem' }}>
                  {room.participants.map((user, index) => {
                    const isAdmin = adminList.includes(user.username);
                    return (
                    <span key={user.id} style={{marginRight: "10px", color: isAdmin ? 'red' : 'black' }}>
                      <a href={`http://localhost:3000/profile/${user.username}`}>{user.username}</a>
                      {(index + 1) % 3 === 0 ? <br /> : null}
                    </span>);
                  })}
                </div>
                <form className='' onSubmit={handleSubmitAdmin}>
                    <h2 className='underline'>Add an admin :</h2>
                    <input className='' type='text' name='username' value={addAdminUsername.username} onChange={handleInputAddAdmin}/>
                </form>
                <form className='' onSubmit={handleSubmit}>
                    <h2 className='underline'>Add a member :</h2>
                    <input className='' type='text' name='username' value={addMemberUsername.username} onChange={handleInputAddMember}/>
                </form>
            </div>
            <div>
                <SettingRoomField room={room} token={token}/>
            </div>
          </div>
          {/* <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900'/> */}
          {/* <div className='bg-violet-700 rounded-lg m-5'>
            <div className='grid grid-cols-2 items-center p-5'>
              <div className='text-center mx-auto'>
                <SettingProfile item={{ accessToken: token?.accessToken }}/>
              </div>
              <div className='text-center mx-auto'>
                <Setting2FA item={{ accessToken: token?.accessToken }} />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ChatRoomSettings;
