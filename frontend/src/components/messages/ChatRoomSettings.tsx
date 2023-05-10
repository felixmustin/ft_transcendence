import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { ChatRoomInterface, ProfileInterface } from './types';
import SettingRoomField from './SettingRoomField';
import { useNavigate } from 'react-router-dom';

type Props = {
  room:ChatRoomInterface | undefined;
  id: number;
  socket: Socket | undefined;
  token: string | undefined;
};

const ChatRoomSettings= ({ room, id, socket,token }: Props) => {

  const [addMemberUsername, setAddMemberUsername] = useState({username:''});
  const [addAdminUsername, setAddAdminUsername] = useState({username:''});

  const [adminList, setAdminList] = useState<ProfileInterface[]>([]);

  const navigate = useNavigate();


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

    const deleteRoom = async () => {
     const auth = 'Bearer ' + token;
     const url = 'http://localhost:3001/chatroom/' + room?.id;
     try {
       const res = await fetch(url, { method: 'DELETE', headers: { Authorization: auth } });
       const result = await res.json();
       console.log('deleteRoom result:', result);
       navigate('/chatpage');
     } catch (error) {
       console.error('Error deleting room:', error);
     }
   };

  const isAdmin = (member: ProfileInterface) => {
    if (!room || !room.admin) return false;
    for (const admin of room.admin) {
      if (admin.id === member.id) {
        return true;
      }
    }
    return false;
  };

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
      body: JSON.stringify({roomId: room?.id, username: addMemberUsername.username})
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

      if (!room) return;
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
      <div className="flex text-center bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 relative w-2/3 p-3 rounded-lg">
        <div className="bg-violet-900 w-[1000px] rounded-lg m-5">
          <p className="text-white text-3xl font-bold m-5">{room?.name} Settings</p>
          <div className="grid grid-cols-2 items-center p-5">
            <div className="grid grid-rows-3">
              <div className="m-3">
                <label>Members</label>
                <div className="flex flex-row overflow-x-auto text-center whitespace-nowrap mt-2 space-x-4">
                  {room?.participants.map((member) => (
                    <span
                      key={member.id}
                      className={`${
                        isAdmin(member) ? "text-yellow-400" : "text-white"
                      }`}
                    >
                      {member.username}
                    </span>
                  ))}
                </div>
              </div>
              <div className="m-3">
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
              <div className="m-3">
                <form onSubmit={handleSubmitAdmin}>
                  <label className="font-bold">Add an admin : </label>
                  <input
                    className="bg-white rounded-lg text-black"
                    type="text"
                    name="username"
                    value={addAdminUsername.username}
                    onChange={handleInputAddAdmin}
                  />
                </form>
              </div>
            </div>
            <div>
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
    
    //<div className="bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 relative w-2/3 p-3 rounded-lg">
    //  <div className="flex justify-evenly">
    //    <div className='bg-violet-900 w-[1000px] rounded-lg m-5'>
    //      <div className='text-center text-white text-2xl p-3 m-2'>
    //        <h2>{room?.name} Settings</h2>
    //      </div>
    //      <div className='grid grid-cols-2 items-center p-5'>
    //        <div>
    //            <div className='underline'>Members</div>
    //            {/* <Participants roomId={room.id} id={id} isSettings={true}/> */}
    //            <div style={{ fontSize: '0.9rem' }}>
    //              {room?.participants.map((user, index) => {
    //                const isAdmin = adminList.includes(user.username);
    //                return (
    //                <span key={user.id} style={{marginRight: "10px", color: isAdmin ? 'red' : 'black' }}>
    //                  <a href={`http://localhost:3000/profile/${user.username}`}>{user.username}</a>
    //                  {(index + 1) % 3 === 0 ? <br /> : null}
    //                </span>);
    //              })}
    //            </div>
    //            <form className='' onSubmit={handleSubmitAdmin}>
    //                <h2 className='underline'>Add an admin :</h2>
    //                <input className='' type='text' name='username' value={addAdminUsername.username} onChange={handleInputAddAdmin}/>
    //            </form>
    //            <form className='' onSubmit={handleSubmit}>
    //                <h2 className='underline'>Add a member :</h2>
    //                <input className='' type='text' name='username' value={addMemberUsername.username} onChange={handleInputAddMember}/>
    //            </form>
    //        </div>
    //        <div>
    //            <SettingRoomField room={room} token={token}/>
    //        </div>
    //      </div>
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
    //    </div>
    //  </div>
    //</div>

};

export default ChatRoomSettings;
