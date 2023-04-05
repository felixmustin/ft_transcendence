import React from 'react'
import { MessageInterface } from './types'

type Props = {
  message: MessageInterface,
  currentUserId: number
}

const Message = ({ message, currentUserId}: Props) => {
  const bubbleStyle = {
    display: 'inline-block',
    backgroundColor: message.user_id === currentUserId ? '#4FD1C5' : '#2d3748',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem',
    marginBottom: '1rem',
    maxWidth: '80%'
  }

  return (
    <div className='chat chat-start' style={{ display: 'flex', justifyContent: message.user_id === currentUserId ? 'flex-end' : 'flex-start' }}>
      <div style={bubbleStyle}>{ message.content }</div>
    </div>
  )
}

export default Message