import React from 'react'
import ChatBox from './ChatBox'
import SendMessage from './SendMessage'

type Props = {}

const ChatRoom = (props: Props) => {
  return (
    <div className='bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 relative w-2/3 p-3 rounded-lg'>
      <ChatBox />
      <SendMessage />
    </div>
  )
}

export default ChatRoom