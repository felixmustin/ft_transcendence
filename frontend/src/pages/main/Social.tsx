import React, { useState } from 'react'
import Navbar from '../../components/design/Navbar'
import Chat from '../../components/messages/Chat'
import FriendList from '../../components/user/FriendList'

type Props = {}

const Social = (props: Props) => {

  const [activeTab, setActiveTab] = useState('friends')

  const renderTabContent = () => {
    if (activeTab === 'friends')
      return ( <FriendList /> )
    else if (activeTab === 'messages')
      return ( <Chat /> )
  }

  return (
    <div className='app bg-gradient-to-tl from-violet-900 via-black to-black w-full overflow-hidden'>
        <div className="bg-black flex justify-center items-center px-6 sm:px-16 border-b-2 border-violet-900">
            <div className="xl:max-w-[1280px] w-full">
                  <Navbar />
            </div>
        </div>

    <div className="flex justify-evenly">
      <div className='bg-violet-900 w-[800px] rounded-lg m-5'>
        <div className='grid grid-cols-2 content-center text-center text-violet-700 text-3xl p-5' >
          <div
            className={`cursor-pointer ${activeTab === 'friends' ? 'text-white' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            Friends
          </div>
          <div
            className={`cursor-pointer ${activeTab === 'messages' ? 'text-white' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </div>
        </div>
        <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900'/>
        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Social

// import React, { useEffect, useState } from 'react'
// import Navbar from '../../components/design/Navbar'
// import loginImg from '../../assets/login.jpg'
// import SocialData from '../../components/user/SocialData'
// import { useNavigate } from 'react-router-dom'


// type Props = {}

// const Social = (props: Props) => {

//   const [error, setError] = useState(null);
//   // Loading management
//   const [isLoaded, setIsLoaded] = useState(false);
//   // User data retrieved from the API
//   const [friends, setFriends] = useState([]);
//   // Navigation
//   const navigate = useNavigate();
//   // Cookies and auth
//   const token = Cookies.get("access_token");
//   const auth = 'Bearer ' + token;

//   useEffect(() => {
//     const fetchData = async () => {
//       const url = 'http://localhost:3001/friends/get/list/profiles';

//       try {
//         const res = await fetch(url, { method: 'GET', headers: { 'Authorization': auth } });
//         const result = await res.json();

//         console.log(result)
//         setIsLoaded(true);
//         setFriends(result);
//       } catch (error) {
//         setIsLoaded(true);
//         setError(error);
//       }
//     };

//     if (!token) {
//       navigate('/');
//     } else {
//       fetchData();
//     }
//   }, [token, navigate]);

//   return (
//     <div className='app bg-gradient-to-tl from-violet-900 via-black to-black w-full overflow-hidden'>
// 		<div className="bg-black flex justify-center items-center px-6 sm:px-16 border-b-2 border-violet-900">
// 			<div className="xl:max-w-[1280px] w-full">
// 				  <Navbar />
// 			</div>
// 		</div>

//     <div className="flex justify-evenly">
//       <div className='bg-violet-900 w-[800px] rounded-lg m-5'>
//         <div className='text-center text-white text-3xl p-5'>
//           Friends
//         </div>
//         <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900'/>
//         <div className='grid grid-cols-5 text-center text-white bg-gray-900 rounded-lg p-2 m-2'>
//           <h2>Picture</h2>
//           <h2>Username</h2>
//           <h2>Rank</h2>
//           <h2>Status</h2>
//         </div>
//         <div className='bg-violet-700 rounded-lg p-2 m-2'>

//           {Object.entries(friends).map(([key, profile]) => (
//             <SocialData key={key} profile={profile} />
//           ))}

//         </div>
//       </div>
//     </div>

// 	</div>
//   )
// }

// export default Social