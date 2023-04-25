import './index.css'
import { BrowserRouter, Routes, Route, Outlet, useParams } from 'react-router-dom'
import Login from './pages/authentification/Login'
import Signup from './pages/authentification/Signup'
import Home from './pages/main/Home'
import Profile from './pages/main/Profile'
import Social from './pages/main/Social'
import Log42Page from './pages/authentification/Log42Page'
import UserInfo from './components/authentication/UserInfo'
import Settings from './pages/main/Settings'
import Play from './pages/main/Play'
import ChatPage from './pages/main/ChatPage'
// import {SocketContext, socket} from './context/Socket';

function ProfileWrapper() {
    const { username } = useParams<{ username?: string }>();
    return <Profile username={username} />;
  }

function App() {
  return (
    // <SocketContext.Provider value={socket}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/log42page' element={<Log42Page/>} />
        <Route path='/home' element={<Home />} />
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
    // </SocketContext.Provider>
  )
}

export default App