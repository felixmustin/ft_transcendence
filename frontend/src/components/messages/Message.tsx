import React from 'react'

type Props = {
  message: {
    text: string,
    id: number,
    sentByCurrentUser: boolean
  },
  currentUserId: number
}

const Message = (props: Props) => {
  const bubbleStyle = {
    display: 'inline-block',
    backgroundColor: props.message.sentByCurrentUser ? '#4FD1C5' : '#2d3748',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem',
    marginBottom: '1rem',
    maxWidth: '80%'
  }


  return (
    <div className='chat chat-start' style={{ display: 'flex', justifyContent: props.message.sentByCurrentUser ? 'flex-end' : 'flex-start' }}>
      <div style={bubbleStyle}>{props.message.text}</div>
    </div>
  )
}

export default Message
