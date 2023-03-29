import React from 'react'
import ConvBox from './ConvBox'

type Props = {}

const convs = [
  { userId: 1, picture: '', lastMessage: 'Hello', read: false},
  { userId: 2, picture: '', lastMessage: 'Well ...', read: true},
  { userId: 3, picture: '', lastMessage: 'NVM', read: false},
]

const Conversations = (props: Props) => {
  return (
    <div className='bg-violet-800 w-1/3 rounded-lg mx-1'>
      {convs.map((conv) => (
        <ConvBox conv={conv}/>
      ))}
    </div>
  )
}

export default Conversations