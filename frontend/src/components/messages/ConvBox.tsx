import React from 'react'
import loginImg from '../../assets/login.jpg'

type Props = {
  conv: {
    userId: number,
    picture: string,
    lastMessage: string,
    read: boolean
  }
}

const ConvBox = (props: Props) => {

  const read = props.conv.read
  const readClass = read ? 'bg-green-300' : 'bg-red-400'

  return (
    <div className={`flex ${readClass} my-1 rounded-lg`}>
      <div className='w-1/3'><img src={loginImg} className='rounded-full h-10 w-10'/></div>
      <div className='w-2/3 text-center text-black'>{props.conv.lastMessage}</div>
    </div>
  )
}

export default ConvBox