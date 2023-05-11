import React, { useEffect, useState } from 'react'
import Navbar from '../../components/design/Navbar'
import FriendList from '../../components/user/FriendList'
import BlockedUsers from '../../components/user/BlockedUsers'
import Loading from '../../components/utils/Loading'
import SocketContext from '../../context/Socket'

type Props = {
  token: string;
}

const Social = ({token}: Props) => {

  const [currentTab, setCurrentTab] = useState('Friends');
  const { SocketState, SocketDispatch } = React.useContext(SocketContext);

  SocketState.socket?.emit('friend-visited');
  if (!token)
    return <Loading />
  else {
    return (
      <div className='app bg-gradient-to-tl from-violet-900 via-black to-black w-full'>
          <div className="bg-black flex justify-center items-center px-6 sm:px-16 border-b-2 border-violet-900">
              <div className="xl:max-w-[1280px] w-full">
                    <Navbar accessToken={token}/>
              </div>
          </div>

        <div className="flex justify-evenly">
          <div className='bg-violet-900 w-[800px] rounded-lg m-5'>
            <div className='flex justify-between text-center text-white text-3xl p-5' >
              <div className='mx-5' onClick={() => setCurrentTab('Friends')} style={{cursor: 'pointer'}}>Friends</div>
              <span>|</span>
              <div className='mx-5' onClick={() => setCurrentTab('Blocked')} style={{cursor: 'pointer'}}>Blocked</div>
            </div>
            <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900'/>
            <div>
              {/* Conditionally render different components based on the current tab */}
              {currentTab === 'Friends' && <FriendList accessToken={ token } />}
              {currentTab === 'Blocked' && <BlockedUsers accessToken={ token } />} 
              {/* Replace BlockedUsers with the name of your Blocked users component */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Social 
