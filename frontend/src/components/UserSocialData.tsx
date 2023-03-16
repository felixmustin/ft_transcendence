import React from 'react'
import loginImg from '../assets/login.jpg'

type Props = {
  item: {
    picture: string;
    username: string;
    rank: number;
    status: number;
  };
}

const UserSocialData = (props: Props) => {

  return (
    <div>
      <div className='grid grid-cols-4 text-center text-white items-center m-3 p-2'>
        <img className='rounded-full h-[50px] w-[50px]' src={ props.item.picture }/>
        <h1>{ props.item.username }</h1>
        <h1>{ props.item.rank }</h1>
        <h1>{ props.item.status }</h1>
      </div>
      <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-violet-900'/>
    </div>
  )
}

export default UserSocialData