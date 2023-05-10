import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatRoomInterface, ProfileInterface } from './types';

type Props = {
  user: ProfileInterface;
  room: ChatRoomInterface;
  profileId: number;
};

const SingleParticipant = ({ user, room, profileId }: Props) => {

  const navigate = useNavigate();
  const visitUser = () => {
    navigate(`/profile/${user.username}`);
  };

  const isAdmin = room.admins.some((adminId) => adminId === profileId);

  const getStatusDotColor = (statusId: number) => {
    switch (statusId) {
      case 0:
        return 'bg-gray-500';
      case 1:
        return 'bg-green-500';
      case 2:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="inline-flex items-center bg-gray-300 text-black px-4 py-2 m-2 rounded-lg shadow-md">
      {user.id !== profileId && (
        <span
          className={`w-2 h-2 mr-2 rounded-full ${getStatusDotColor(
            user.statusid
          )}`}
        ></span>
      )}
      <div className="mr-4 font-bold">{user.username}</div>
      {user.id !== profileId && (
        <button className="bg-gradient-to-tl from-violet-900 via-black to-black text-white font-xs rounded mr-2 px-1 hover:bg-black">
          Play
        </button>
      )}
      {user.id !== profileId && (
        <button
        className="bg-gradient-to-tl from-violet-900 via-black to-black text-white font-xs rounded px-1 hover:bg-black"
        onClick={visitUser}>
          Visit
        </button>
      )}
    </div>
  );
};

export default SingleParticipant;






// import React, { useState, useEffect } from 'react';
// import { Socket } from 'socket.io-client';
// import { ChatRoomInterface, ProfileInterface } from './types';
// import SettingRoomField from './SettingRoomField';
// import { useNavigate } from 'react-router-dom';

// type Props = {
//   room:ChatRoomInterface;
//   id: number;
//   socket: Socket | undefined;
//   token: string | undefined;
// };

// const ChatRoomSettings= ({ room, id, socket,token }: Props) => {

//   const [addMemberUsername, setAddMemberUsername] = useState({username:''});
//   const [addAdminUsername, setAddAdminUsername] = useState({username:''});

//   const [adminList, setAdminList] = useState([]);
//   const [isAdmin, setIsAdmin] = useState(false);


//   const navigate = useNavigate();
//   // const [showActionBoxId, setShowActionBoxId] = useState(0);
//   // const [selectedUser, setSelectedUser] = useState<ProfileInterface>();
//   // const [selectedOption, setSelectedOption] = useState('');
//   // const [selectedDuration, setSelectedDuration] = useState('');
//   // const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
//   // const [selectedAdminOptions, setSelectedAdminOptions] = useState('');


//   useEffect(() => {
//     const fetchData = async () => {
//       const auth = 'Bearer ' + token;
//       const url = `http://localhost:3001/chatroom/admin/list`

//       try {
//         const res = await fetch(url, { method: 'GET', headers: { 'Authorization': auth } });
//         const result = await res.json();
//         if (result.statusCode >=400)
//           alert(result.message)
//         else {
//           setAdminList(result);
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     };
//     fetchData();
//   }, []);

//     const deleteRoom = async () => {
//      const auth = 'Bearer ' + token;
//      const url = 'http://localhost:3001/chatroom/' + room?.id;
//      try {
//        const res = await fetch(url, { method: 'DELETE', headers: { Authorization: auth } });
//        const result = await res.json();
//        console.log('deleteRoom result:', result);
//        navigate('/chatpage');
//      } catch (error) {
//        console.error('Error deleting room:', error);
//      }
//    };

//   const isAdminFct = (member: ProfileInterface) => {
//     const isAdmin = adminList.includes(member.username);
//     return isAdmin
//   };

//   const handleInputAddMember = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = event.target;
//     setAddMemberUsername(prevState => ({ ...prevState, [name]: value }));
//   };

//   const handleInputAddAdmin = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = event.target;
//     setAddAdminUsername(prevState => ({ ...prevState, [name]: value }));
//   };

//   // const handleUserClick = (e: any, user: ProfileInterface) => {
//   //   e.preventDefault();
//   //   if (showActionBoxId == user.id) {
//   //     setShowActionBoxId(0);
//   //     setSelectedOption('')
//   //     setSelectedDuration('')
//   //   }
//   //   else {
//   //     setSelectedUser(user);
//   //     setShowActionBoxId(user.id);
//   //     setPopupPosition({
//   //       top: e.currentTarget.offsetTop + 100,
//   //       left: e.currentTarget.offsetLeft
//   //     });
//   //   }
//   // };

//   // const handleDurationChange = (e: any) => setSelectedDuration(e.target.value);


//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const auth = 'Bearer ' + token;

//       await fetch('http://localhost:3001/chatroom/addMember', {
//       method: 'POST',
//       headers: {
//       'Authorization': auth,
//       'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({roomId: room?.id, username: addMemberUsername.username})
//       }).then(response => {
//         if (response.ok) {
//           alert("Member added");
//         } else {
//           alert("Problem adding member");
//         }
//       });
  
//     }

//     // const handleSubmitAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
//     //   event.preventDefault();
//     //   const auth = 'Bearer ' + token;

//     //   for (const participant of room.participants) {
//     //     console.log(participant)
//     //     if (addAdminUsername.username == participant.username) {
//     //       await fetch('http://localhost:3001/chatroom/addAdmin', {
//     //       method: 'POST',
//     //       headers: {
//     //       'Authorization': auth,
//     //       'Content-Type': 'application/json',
//     //       },
//     //       body: JSON.stringify({roomId: room.id, username: addAdminUsername.username})
//     //       }).then(response => {
//     //         if (response.ok) {
//     //           alert("Member added as admin");
//     //         } else {
//     //           alert("Problem adding member as admin");
//     //         }
//     //       });
//     //     }
//     //   }
//     // }

//     const handleSubmitAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
//       event.preventDefault();
//       const auth = 'Bearer ' + token;
//       // let url = ''
//       // let body = ''

//       // if (selectedUser) {
//       //   if (selectedOption == 'mute') {
//       //     url = 'http://localhost:3001/chatroom/mute'
//       //     body = JSON.stringify({roomId: room.id, username: selectedUser.username, duration: selectedDuration})
//       //   }
//       //   else if (selectedOption == 'ban') {
//       //     url = 'http://localhost:3001/chatroom/ban'
//       //     body = JSON.stringify({roomId: room.id, username: selectedUser.username, duration: selectedDuration})
//       //   }
//       //   else if (selectedOption == 'admin') {
//       //     body = JSON.stringify({roomId: room.id, username: selectedUser.username})
//       //     if (selectedAdminOptions == "add")
//       //       url = 'http://localhost:3001/chatroom/addAdmin'
//       //     else if (selectedAdminOptions == "remove")
//       //       url = 'http://localhost:3001/chatroom/removeAdmin'
//       //   }
      
//       // if (!room) return;
//       //   await fetch(url, {
//       //       method: 'POST',
//       //       headers: {
//       //       'Authorization': auth,
//       //       'Content-Type': 'application/json',
//       //       },
//       //       body: body
//       //       }).then(response => {
//       //         if (response.ok) {
//       //           alert(response.statusText);
//       for (const participant of room.participants) {
//         console.log(participant)
//         if (addAdminUsername.username == participant.username) {
//           await fetch('http://localhost:3001/chatroom/addAdmin', {
//           method: 'POST',
//           headers: {
//           'Authorization': auth,
//           'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({roomId: room.id, username: addAdminUsername.username})
//           }).then(response => {
//             if (response.ok) {
//               alert("Member added as admin");
//             } else {
//               alert("Problem adding member as admin");
//             }
//           });
//         }
//       }
//     }

//     return (
//       <div className="flex text-center bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 relative w-2/3 p-3 rounded-lg">
//         <div className="bg-violet-900 w-[1000px] rounded-lg m-5">
//           <p className="text-white text-3xl font-bold m-5">{room?.name} Settings</p>
//           <div className="grid grid-cols-2 items-center p-5">
//             <div className="grid grid-rows-3">
//               <div className="m-3">
//                 <label>Members</label>
//                 <div className="flex flex-row overflow-x-auto text-center whitespace-nowrap mt-2 space-x-4">
//                   {room?.participants.map((member) => (
//                     <span
//                       key={member.id}
//                       className={`${
//                         isAdminFct(member) ? "text-yellow-400" : "text-white"
//                       }`}
//                     >
//                       {member.username}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//               <div className="m-3">
//                 <form onSubmit={handleSubmit}>
//                   <label className="font-bold">Add member : </label>
//                   <input
//                     className="bg-white rounded-lg text-black"
//                     type="text"
//                     name="username"
//                     value={addMemberUsername.username}
//                     onChange={handleInputAddMember}
//                   />
//                 </form>
//               </div>
//               <div className="m-3">
//                 <form onSubmit={handleSubmitAdmin}>
//                   <label className="font-bold">Add an admin : </label>
//                   <input
//                     className="bg-white rounded-lg text-black"
//                     type="text"
//                     name="username"
//                     value={addAdminUsername.username}
//                     onChange={handleInputAddAdmin}
//                   />
//                 </form>
//               </div>
//             </div>
//             <div>
//               <SettingRoomField room={room} token={token} />
//             </div>
//           </div>
//           <button
//             className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded my-3"
//             onClick={() => deleteRoom()}
//           >
//             Delete room
//           </button>
//         </div>
//       </div>
//     );
    
//     //<div className="bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 relative w-2/3 p-3 rounded-lg">
//     //  <div className="flex justify-evenly">
//     //    <div className='bg-violet-900 w-[1000px] rounded-lg m-5'>
//     //      <div className='text-center text-white text-2xl p-3 m-2'>
//     //        <h2>{room?.name} Settings</h2>
//     //      </div>
//     //      <div className='grid grid-cols-2 items-center p-5'>
//     //        <div>
//     //            <div className='underline'>Members</div>
//     //            {/* <Participants roomId={room.id} id={id} isSettings={true}/> */}
//     //            <div style={{ fontSize: '0.9rem' }}>
//     //              {room?.participants.map((user, index) => {
//     //                const isAdmin = adminList.includes(user.username);
//     //                return (
//     //                <span key={user.id} style={{marginRight: "10px", color: isAdmin ? 'red' : 'black' }}>
//     //                  <a href={`http://localhost:3000/profile/${user.username}`}>{user.username}</a>
//     //                  {(index + 1) % 3 === 0 ? <br /> : null}
//     //                </span>);
//     //              })}
//     //            </div>
//     //            <form className='' onSubmit={handleSubmitAdmin}>
//     //                <h2 className='underline'>Add an admin :</h2>
//     //                <input className='' type='text' name='username' value={addAdminUsername.username} onChange={handleInputAddAdmin}/>
//     //            </form>
//     //            <form className='' onSubmit={handleSubmit}>
//     //                <h2 className='underline'>Add a member :</h2>
//     //                <input className='' type='text' name='username' value={addMemberUsername.username} onChange={handleInputAddMember}/>
//     //            </form>
//     //        </div>
//     //        <div>
//     //            <SettingRoomField room={room} token={token}/>
//     //        </div>
//     //      </div>
//           {/* <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900'/> */}
//           {/* <div className='bg-violet-700 rounded-lg m-5'>
//             <div className='grid grid-cols-2 items-center p-5'>
//               <div className='text-center mx-auto'>
//                 <SettingProfile item={{ accessToken: token?.accessToken }}/>
//               </div>
//               <div className='text-center mx-auto'>
//                 <Setting2FA item={{ accessToken: token?.accessToken }} />
//               </div>
//             </div>
//           </div> */}
//     //    </div>
//     //  </div>
//     //</div>

// };

// export default ChatRoomSettings;

