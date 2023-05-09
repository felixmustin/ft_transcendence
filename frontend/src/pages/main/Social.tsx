import React, { useEffect, useState } from 'react'
import Navbar from '../../components/design/Navbar'
import Chat from '../../components/messages/Chat'
import FriendList from '../../components/user/FriendList'
import BlockedUsers from '../../components/user/BlockedUsers'
import { tokenForm } from '../../interfaceUtils'
import { useNavigate } from 'react-router-dom'
import { getSessionsToken, isSessionTokenSet } from '../../sessionsUtils'
import Loading from '../../components/utils/Loading'

type Props = {}

const Social = (props: Props) => {

  const [token, setToken] = useState<tokenForm>();
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [currentTab, setCurrentTab] = useState('Friends'); // Add a state for the current tab

  // Navigation
  const navigate = useNavigate();
  // Session and auth
  useEffect(() => {
    async function getToken() {
      const sessionToken = await getSessionsToken();
      setToken(sessionToken);
      setIsTokenSet(true)
    }
    if (!isSessionTokenSet()) // '!'token
        navigate('/');
    else
      getToken();
  }, []);

  if (!isTokenSet)
    return <Loading />
  else {
    return (
      <div className='app bg-gradient-to-tl from-violet-900 via-black to-black w-full overflow-hidden'>
          <div className="bg-black flex justify-center items-center px-6 sm:px-16 border-b-2 border-violet-900">
              <div className="xl:max-w-[1280px] w-full">
                    <Navbar item={token}/>
              </div>
          </div>

        <div className="flex justify-evenly">
          <div className='bg-violet-900 w-[800px] rounded-lg m-5'>
            <div className='flex justify-between text-center text-violet-300 text-3xl p-5' >
              {/* Add tabs for Friends and Blocked */}
              <div className='mx-5' onClick={() => setCurrentTab('Friends')} style={{cursor: 'pointer'}}>Friends</div>
              <span>|</span>
              <div className='mx-5' onClick={() => setCurrentTab('Blocked')} style={{cursor: 'pointer'}}>Blocked</div>
            </div>
            <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900'/>
            <div>
              {/* Conditionally render different components based on the current tab */}
              {currentTab === 'Friends' && <FriendList accessToken={ token?.accessToken } />}
              {currentTab === 'Blocked' && <BlockedUsers accessToken={ token?.accessToken } />} 
              {/* Replace BlockedUsers with the name of your Blocked users component */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Social 
