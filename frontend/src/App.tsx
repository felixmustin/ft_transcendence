import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./components/Login"
import Home from "./components/Home"
import Signup from "./components/Signup"
import UserInfo from "./components/UserInfo"
import GamePong from './components/Pong'
import Profile from './components/Profile'
import Disconnect from './components/Disconnect'

function setToken(userToken: any) {
  localStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = localStorage.getItem('token');
  let userToken;
  if (tokenString)
    userToken = JSON.parse(tokenString);
  return userToken
}

function deleteToken() {
  localStorage.removeItem('token');
}

function App() {
  //const token = getToken();
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/pong' element={<GamePong/>}/>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/home" element={<Home getToken={getToken} />} />
        <Route path='/signup' element={<Signup setToken={setToken} />} />
        <Route path='/userinfo' element={<UserInfo getToken={getToken} />} />
        <Route path='/profile' element={<Profile getToken={getToken} />} />
        <Route path='/disconnect' element={<Disconnect deleteToken={deleteToken} getToken={getToken} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App