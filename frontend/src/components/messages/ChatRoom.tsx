import React from 'react'
import ChatBox from './ChatBox'
import SendMessage from './SendMessage'

type Props = {
  roomId: number;
}

const ChatRoom = ({ roomId }: Props) => {
  return (
    <div className='bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 relative w-2/3 p-3 rounded-lg'>
      <ChatBox roomId={roomId}/>
      <SendMessage roomId={ roomId }/>
    </div>
  )
}

export default ChatRoom