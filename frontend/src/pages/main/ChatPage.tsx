import React, { useEffect, useState } from 'react';

import Navbar from '../../components/design/Navbar';
import Chat from '../../components/messages/Chat';
import { useNavigate } from 'react-router-dom'
import Loading from '../../components/utils/Loading';
import SocketContextComponent from '../../context/ComponentSocket';
import SocketContext from '../../context/Socket';

type Props = {
  token: string;
};

const ChatPage = ({token}: Props) => {

  const { SocketState, SocketDispatch } = React.useContext(SocketContext);
  if (!token)
    return <Loading />
  else
  {
    return (
      <div className="app bg-gradient-to-tl from-violet-900 via-black to-black w-full overflow-hidden">
        <div className="bg-black flex justify-center items-center px-6 sm:px-16 border-b-2 border-violet-900">
          <div className="xl:max-w-[1280px] w-full">
            <Navbar accessToken={token}/>
          </div>
        </div>
        {token ? (
          <SocketContextComponent token={token} adress="http://localhost:3001/chat">
          <Chat accessToken={token} statusocket={SocketState} />
          </SocketContextComponent>
            ) : (
              <p>Loading...</p>
            )}
      </div>
    );
  }
};

export default ChatPage;



















//import React, { useEffect, useState } from 'react'
//import Navbar from '../../components/design/Navbar'
//import Chat from '../../components/messages/Chat'
//import { getSessionsToken, isSessionTokenSet } from '../../sessionsUtils'
//import { tokenForm } from '../../interfaceUtils'
//import { useNavigate } from 'react-router-dom'
//import Loading from '../../components/utils/Loading'
//import jwtDecode from 'jwt-decode';

//type Props = {}

//const ChatPage = (props: Props) => {

//    const [token, setToken] = useState<tokenForm>();
//    const [isTokenSet, setIsTokenSet] = useState(false);
  
//    const navigate = useNavigate();

//    useEffect(() => {
//      async function getToken() {
//        const sessionToken = await getSessionsToken();
//        setToken(sessionToken);
//        setIsTokenSet(true)
//      }
//      if (!isSessionTokenSet()) // '!'token
//        navigate('/');
//    else 
//      getToken();
//    }, []);

//if (!isTokenSet)
//    <Loading />
//else {
//  return (
//    <div className="app bg-gradient-to-tl from-violet-900 via-black to-black w-full overflow-hidden">
//        <div className="bg-black flex justify-center items-center px-6 sm:px-16 border-b-2 border-violet-900">
//          <div className="xl:max-w-[1280px] w-full">
//            <Navbar />
//          </div>
//        </div>
//        <Chat item={{ accessToken: token?.accessToken }}/>
//    </div>
//  )
//}
//}

//export default ChatPage