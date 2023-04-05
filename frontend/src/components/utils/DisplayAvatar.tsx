import React from 'react'
import { Buffer } from 'buffer';


type Props = {
    avatar: {
      type: string,
      data: []
      };
}

const DisplayAvatar = (props: Props) => {
  
    const img = Buffer.from(props.avatar.data).toString('base64')

  return (
    <div> 
        <p className='relative'>
            {props.avatar && (
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