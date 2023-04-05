import React, { useState } from 'react'
import Logo from '../../assets/Logo.png'
import Disconnect from '../authentication/Disconnect';
import { useNavigate } from 'react-router-dom'


type Props = {}

const Navbar = (props: Props) => {

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && search.trim()) {
      navigate(`/profile/${search}`);
    }
  };

  return (
    <nav className="w-full flex py-4 justify-between items-center navbar">
    <a href='/home'><img src={ Logo } className='w-[100px] h-[100px]' /> </a>
    <input
      className="rounded-lg bg-gray-700 m-2 ml-10 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
      placeholder="  Search for Targets"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={handleSearch}
    />
    <ul className="list-none sm:flex hidden justify-end items-center flex-1">
      <li className="font-poppins font-normal cursor-pointer text-gray-200 text-xl hover:text-violet-800 mr-5"><a href="/home">Home</a></li>
      <li className="font-poppins font-normal cursor-pointer text-gray-200 text-xl hover:text-violet-800 mr-5"><a href="/play">Play</a></li>
      <li className="font-poppins font-normal cursor-pointer text-gray-200 text-xl hover:text-violet-800 mr-5"><a href="/profile">Profile</a></li>
      {/*<li className="font-poppins font-normal cursor-pointer text-gray-200 text-xl hover:text-violet-800 mr-5"><a href="/ladder">Ladder</a></li>*/}
      <li className="font-poppins font-normal cursor-pointer text-gray-200 text-xl hover:text-violet-800 mr-5"><a href="/social">Social</a></li>
      {/*<li className="font-poppins font-normal cursor-pointer text-gray-200 text-xl hover:text-violet-800 mr-5"><a href="/chat">Chat</a></li>*/}
      <li className="font-poppins font-normal cursor-pointer text-gray-200 text-xl hover:text-violet-800 mr-5"><a href="/settings">Settings</a></li>
      <button onClick={() => setOpen(true)} className='w-[100px] py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg'>Log Out</button>
      {open ? <Disconnect /> : null}
    </ul>
  </nav>
  )
}

export default Navbar