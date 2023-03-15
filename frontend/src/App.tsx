import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Npinheir from "./components/npinheir/Npinheir"
import UserInfo from "./components/UserInfo"
import GamePong from './components/Pong'
import Profile from './pages/Profile'
import Disconnect from './components/Disconnect'
import UsernameInput from './pages/UsernameInput'

// function setToken(userToken: any) {
//   localStorage.setItem('token', JSON.stringify(userToken));
// }

// function getToken() {
//   const tokenString = localStorage.getItem('token');
//   let userToken;
//   if (tokenString)
//     userToken = JSON.parse(tokenString);
//   return userToken
// }

// function deleteToken() {
//   localStorage.removeItem('token');
// }

function App() {
  // const token = getToken();
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/pong' element={<GamePong/>}/>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/usernameinput' element={<UsernameInput/>} />
        <Route path='/userinfo' element={<UserInfo />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/disconnect' element={<Disconnect />} />
        <Route path='/userinfo' element={<UserInfo />} />
        <Route path='/npinheir' element={<Npinheir />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App