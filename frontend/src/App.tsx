import './index.css'
import { BrowserRouter, Routes, Route, Outlet, useParams, useNavigate } from 'react-router-dom'
import Login from './pages/authentification/Login'
import Signup from './pages/authentification/Signup'
import Profile from './pages/main/Profile'
import Social from './pages/main/Social'
import Log42Page from './pages/authentification/Log42Page'
import UserInfo from './components/authentication/UserInfo'
import Settings from './pages/main/Settings'
import Play from './pages/main/Play'
import ChatPage from './pages/main/ChatPage'
import SocketContextComponent from './context/ComponentSocket'
import { useEffect, useState } from 'react'
import { tokenForm } from './interfaceUtils'
import { getSessionsToken } from './sessionsUtils'
// import {SocketContext, socket} from './context/Socket';

function ProfileWrapper() {
    const { username } = useParams<{ username?: string }>();
    return <Profile username={username} />;
  }

function App() {
  const [token, setToken] = useState<tokenForm>();
  // const navigate = useNavigate();

  useEffect(() => {
    async function getToken() {
      const sessionToken = await getSessionsToken();
      // if (!sessionToken)
      //   navigate('/')
      setToken(sessionToken);
    }
    getToken();
  }, []);
  const site = (
    <BrowserRouter>
      <Routes>
        <Route path="/profile/*" element={<ProfileWrapper />}>
          <Route index element={<Profile />} />
          <Route path=":username" element={<Outlet />} />
        </Route>
        <Route path='/social' element={<Social />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/play' element={<Play />} />
        <Route path='/chatpage' element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
  if (token){
  return (<SocketContextComponent token={token.accessToken} adress="ws://127.0.0.1:3001/" children={site}/>)}
  else
  return (
          
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/log42page' element={<Log42Page/>} />
        </Routes>
    </BrowserRouter>
          )
}

export default App