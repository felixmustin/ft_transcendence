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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/usernameinput' element={<UsernameInput/>} />
        <Route path='/home' element={<Home />} />
        <Route path='/profile' element={<Profile username='otheruser'/>} />
        <Route path='/social' element={<Social />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
