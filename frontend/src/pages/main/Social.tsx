import React, { useEffect, useState } from 'react'
import Navbar from '../../components/design/Navbar'
import Chat from '../../components/messages/Chat'
import FriendList from '../../components/user/FriendList'
import { tokenForm } from '../../interfaceUtils'
import { useNavigate } from 'react-router-dom'
import { getSessionsToken, isSessionTokenSet } from '../../sessionsUtils'
import Loading from '../../components/utils/Loading'

type Props = {}

const Social = (props: Props) => {

  const [token, setToken] = useState<tokenForm>();
  const [isTokenSet, setIsTokenSet] = useState(false);

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
                    <Navbar />
              </div>
          </div>

      <div className="flex justify-evenly">
        <div className='bg-violet-900 w-[800px] rounded-lg m-5'>
          <div className='flex content-center text-center text-violet-300 text-3xl p-5' >
            Friends List
          </div>
          <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900'/>
          <div>
            <FriendList item={{ accessToken: token?.accessToken }} />
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default Social