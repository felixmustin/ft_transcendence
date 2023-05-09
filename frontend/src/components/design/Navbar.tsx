import React, { useState } from 'react'
import Logo from '../../assets/Logo.png'
import Disconnect from '../authentication/Disconnect';
import { useNavigate } from 'react-router-dom'
import { tokenForm } from '../../interfaceUtils';
import { noti_payload, notifications } from '../../App';
import SocketContext from '../../context/Socket';


type Props = {
  item: tokenForm | undefined;
}

const Navbar = (props: Props) => {

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  //notif hanler
  const [message_notif, setmessage_notif] = useState(false);
  const [game_notif, setgame_notif] = useState(false);
  const [friend_notif, setfriend_notif] = useState(false);
	const { SocketState, SocketDispatch } = React.useContext(SocketContext);
	const notif_handler = (notif: notifications) => {
    for (let i = 0; i < notif?.notifs?.length; i++){
      if (notif.notifs[i].type === 'game'){
        setgame_notif(true);
      }
      else if (notif.notifs[i].type === 'message'){
        setmessage_notif(true);
      }
      else if (notif.notifs[i].type === 'friend'){
        setfriend_notif(true);
      }
    }
	}
	SocketState.socket?.on('notification', notif_handler);

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && search.trim()) {
      navigate(`/profile/${search}`);
    }
  };

  function displayDisconnectBox() {
    if (open)
      setOpen(false)
    else
      setOpen(true)
  }

  return (
    <nav className="w-full flex py-4 justify-between items-center navbar">
    <a href='/profile'><img src={ Logo } className='w-[100px] h-[100px]' /> </a>
    <input
      className="rounded-lg bg-gray-700 m-2 ml-10 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
      placeholder="  Search for Targets"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={handleSearch}
    />
    <ul className="list-none sm:flex hidden justify-end items-center flex-1">
      <li className="font-poppins font-normal cursor-pointer text-gray-200 text-xl hover:text-violet-800 mr-5"><a href="/play">Play{game_notif && <span className="ml-1 rounded-full w-2 h-2 bg-red-500 inline-block"></span>}</a></li>
      <li className="font-poppins font-normal cursor-pointer text-gray-200 text-xl hover:text-violet-800 mr-5"><a href="/profile">Profile</a></li>
      {/*<li className="font-poppins font-normal cursor-pointer text-gray-200 text-xl hover:text-violet-800 mr-5"><a href="/ladder">Ladder</a></li>*/}
      <li className="font-poppins font-normal cursor-pointer text-gray-200 text-xl hover:text-violet-800 mr-5"><a href="/social">Social{friend_notif && <span className="ml-1 rounded-full w-2 h-2 bg-red-500 inline-block"></span>}</a></li>
      <li className="font-poppins font-normal cursor-pointer text-gray-200 text-xl hover:text-violet-800 mr-5"><a href="/chatpage">Chat{message_notif && <span className="ml-1 rounded-full w-2 h-2 bg-red-500 inline-block"></span>}</a></li>
      {/*<li className="font-poppins font-normal cursor-pointer text-gray-200 text-xl hover:text-violet-800 mr-5"><a href="/chat">Chat</a></li>*/}
      <li className="font-poppins font-normal cursor-pointer text-gray-200 text-xl hover:text-violet-800 mr-5"><a href="/settings">Settings</a></li>
      <div className="relative">
        <button onClick={displayDisconnectBox} className='w-[100px] py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg'>Log Out</button>
        {open ? <Disconnect item={props.item} /> : null}
      </div>
    </ul>
  </nav>
  )
}

export default Navbar