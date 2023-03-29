import React from 'react'
import { Buffer } from 'buffer';


type Props = {
    data: {
        id: number;
        email: string;
        firstname: string;
        lastname: string;
        age: number;
        avatar: {type: string, data: []}
      };
}

const DisplayAvatar = (props: Props) => {
    console.log(props)
    console.log(props.data)

    const img = Buffer.from(props.data.avatar.data).toString('base64')

  return (
    <div> 
        <p className='relative'>
            {props.data.avatar && (
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