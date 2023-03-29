import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/authentification/Login'
import Signup from './pages/authentification/Signup'
import Home from './pages/main/Home'
import Profile from './pages/main/Profile'
import Social from './pages/main/Social'
import UsernameInput from './pages/authentification/UsernameInput'
import UserInfo from './components/authentication/UserInfo'
import Settings from './pages/main/Settings'
import Play from './pages/main/Play'
// import {SocketContext, socket} from './context/Socket';
import Chat from './pages/main/Chat'

function App() {
  console.log('hello from app' );
  return (
    // <SocketContext.Provider value={socket}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/usernameinput' element={<UsernameInput/>} />
        <Route path='/home' element={<Home />} />
        <Route path='/profile' element={<Profile /*username='otheruser'*/ />} />
        <Route path='/social' element={<Social />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/play' element={<Play />} />
      </Routes>
    </BrowserRouter>
    // </SocketContext.Provider>
  )
}

export default App
