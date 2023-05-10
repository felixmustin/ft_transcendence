import './index.css'
import { BrowserRouter, Routes, Route, Outlet, useParams, useNavigate, Navigate } from 'react-router-dom'
import Login from './pages/authentification/Login'
import Signup from './pages/authentification/Signup'
import Profile from './pages/main/Profile'
import Social from './pages/main/Social'
import Log42Page from './pages/authentification/Log42Page'
import Settings from './pages/main/Settings'
import Play from './pages/main/Play'
import ChatPage from './pages/main/ChatPage'
import SocketContextComponent from './context/ComponentSocket'
import { useEffect, useState } from 'react'
import { tokenForm } from './interfaceUtils'
import { getSessionsToken } from './sessionsUtils'
import { type } from 'os'
import Loading from './components/utils/Loading'

type Props = {
  token: tokenForm;
}
// import {SocketContext, socket} from './context/Socket';
export type notification = {
	type: string,
	origin: string,
	target: string,
	data: string,
}
export type status = {
	username: string,
	status: number,
}
export type notifications = {
  name: string,
  notifs: notification[],
}
export type noti_payload = {
	type: string,
	target: string | undefined,
	data: string | undefined,
}

function ProfileWrapper({token}: Props) {
    const { username } = useParams<{ username?: string }>();
    return <Profile username={username} token={token.accessToken}/>;
  }

function App() {
  const [token, setToken] = useState<tokenForm>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getToken() {
      const sessionToken = await getSessionsToken();
      if (sessionToken) {
        setToken(sessionToken);
      }
      setLoading(false)      
    }
    getToken();
  }, []);


  const routes = ( 
  <BrowserRouter>
    <Routes>
      {(token && token.accessToken) ? (
        <>
          <Route path="/" element={<Navigate to="/play" />} />
          <Route path="/profile/*" element={<ProfileWrapper token={token}/>}>
            <Route index element={<Profile token={token.accessToken}/>} />
            <Route path=":username" element={<Outlet />} />
          </Route>
          <Route path='/social' element={<Social token={token.accessToken}/>} />
          <Route path='/settings' element={<Settings token={token.accessToken} />} />
          <Route path='/play' element={<Play token={token.accessToken} />} />
          <Route path='/chatpage' element={<ChatPage token={token.accessToken}/>} />
        </>
      ) : (
        <>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path='/login' element={<Login setToken={setToken} />} />
          <Route path='/signup' element={<Signup setToken={setToken} />} />
          <Route path='/log42page' element={<Log42Page setToken={setToken} />} />
        </>
      )}
    </Routes>
  </BrowserRouter>  );

  
  if (loading) {
    return <Loading />;
  } else if (token && token.accessToken) {
    return (<SocketContextComponent token={token.accessToken} adress="ws://127.0.0.1:3001/" children={routes} />);
  } else {
    return routes;
  }
}

export default App