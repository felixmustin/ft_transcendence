import React from 'react'
import Navbar from "../components/npinheir/Navbar"
import loginImg from '../assets/login.jpg'
import UserSocialData from '../components/UserSocialData'

type Props = {}

const Social = (props: Props) => {
  return (
	<div className='app bg-gradient-to-tl from-violet-900 via-black to-black w-full overflow-hidden'>
		<div className="bg-black flex justify-center items-center px-6 sm:px-16 border-b-2 border-violet-900">
			<div className="xl:max-w-[1280px] w-full">
				  <Navbar />
			</div>
		</div>

    <div className="flex justify-evenly">
      <div className='bg-violet-900 w-[800px] rounded-lg m-5'>
        <div className='text-center text-white text-3xl p-3'>
          Friends
        </div>
        <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900'/>
        <div className='grid grid-cols-4 text-center text-white bg-gray-900 rounded-lg p-2 m-2'>
          <h2>Picture</h2>
          <h2>Username</h2>
          <h2>Rank</h2>
          <h2>Status</h2>
        </div>
        <div className='bg-violet-700 rounded-lg p-2 m-2'>
          <UserSocialData item={{ picture: loginImg, username: 'Username1', rank: 5, status: 1 }}/>
          <UserSocialData item={{ picture: loginImg, username: 'Username1', rank: 5, status: 1 }}/>
          <UserSocialData item={{ picture: loginImg, username: 'Username1', rank: 5, status: 1 }}/>
          <UserSocialData item={{ picture: loginImg, username: 'Username1', rank: 5, status: 1 }}/>
          <UserSocialData item={{ picture: loginImg, username: 'Username1', rank: 5, status: 1 }}/>
        </div>
      </div>
    </div>

	</div>
  )
}

export default Social