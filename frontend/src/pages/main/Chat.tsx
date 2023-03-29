import React, { useState } from 'react'
import Navbar from '../../components/design/Navbar'
import loginImg from '../../assets/login.jpg'
import SocialData from '../../components/user/SocialData'
import ChatRoom from '../../components/messages/ChatRoom'
import Conversations from '../../components/messages/Conversations'

type Props = {}

const Chat = (props: Props) => {

  const [activeTab, setActiveTab] = useState('friends')

  const renderTabContent = () => {
    if (activeTab === 'friends') {
      return (
        <div className='bg-violet-700 rounded-lg p-2 m-2'>
          <SocialData item={{ picture: loginImg, username: 'Username1', rank: 5, status: 1 }}/>
          <SocialData item={{ picture: loginImg, username: 'Username1', rank: 5, status: 1 }}/>
          <SocialData item={{ picture: loginImg, username: 'Username1', rank: 5, status: 1 }}/>
          <SocialData item={{ picture: loginImg, username: 'Username1', rank: 5, status: 1 }}/>
          <SocialData item={{ picture: loginImg, username: 'Username1', rank: 5, status: 1 }}/>
        </div>
      )
    } else if (activeTab === 'messages') {
      return (
        <div className='flex bg-violet-700 rounded-lg p-2 m-2'>
          <ChatRoom />
          <Conversations />
        </div>
      )
    }
  }

  return (
    <div className='app bg-gradient-to-tl from-violet-900 via-black to-black w-full overflow-hidden'>
		<div className="bg-black flex justify-center items-center px-6 sm:px-16 border-b-2 border-violet-900">
			<div className="xl:max-w-[1280px] w-full">
				  <Navbar />
			</div>
		</div>

    <div className="flex justify-evenly">
      <div className='bg-violet-900 w-[800px] rounded-lg m-5'>
        <div className='grid grid-cols-2 content-center text-center text-violet-700 text-3xl p-5' >
          <div
            className={`cursor-pointer ${activeTab === 'friends' ? 'text-white' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            Friends
          </div>
          <div
            className={`cursor-pointer ${activeTab === 'messages' ? 'text-white' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </div>
        </div>
        <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900'/>
        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Chat