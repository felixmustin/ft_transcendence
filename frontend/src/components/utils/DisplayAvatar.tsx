import React from 'react'
import { Buffer } from 'buffer';
import { BufferInterface } from '../messages/types';


type Props = {
    avatar: BufferInterface | undefined;
}

const DisplayAvatar = ({avatar}: Props) => {
  
    const img = Buffer.from(avatar?.data).toString('base64')

  return (
    <div> 
        <p className='relative'>
            {avatar && (
            <img
                src={`data:image/png;base64,${img}`}
                alt="User Avatar"
                className="rounded-full w-[100px] h-[100px]"
            />
            )}
        </p>
    </div>
  )
}

export default DisplayAvatar