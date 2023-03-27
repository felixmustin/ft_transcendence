import React from 'react'
import Message from './Message'

type Props = {}

const ChatBox = (props: Props) => {

  const messages = [
    { text: 'Hello', id: 1, sentByCurrentUser: true },
    { text: 'Hi', id: 2, sentByCurrentUser: false },
    { text: 'How are you ?', id: 3, sentByCurrentUser: true },
  ]

  return (
    <div className='pb-44 pt-20 containerWrap'>
      {messages.map((message) => (
        <Message key={message.id } message={message} currentUserId={2}/>
      ))}
    </div>
  )
}

export default ChatBox