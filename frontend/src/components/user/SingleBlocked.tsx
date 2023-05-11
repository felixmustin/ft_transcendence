import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ProfileInterface } from '../messages/types'
import DisplayAvatar from '../utils/DisplayAvatar'

type Props = {
  profile: ProfileInterface
  token: string | undefined;
}

const SingleBlocked = (props: Props) => {

  const navigate = useNavigate();

  const handleRemove = async () => {
    try {
      const url = 'http://localhost:3001/user/unblock/' + props.profile.id;
      const auth = 'Bearer ' + props.token;
      const res = await fetch(url, { method: 'DELETE', headers: { 'Authorization': auth } });
      if (res.ok) {
        window.location.reload();
      }
    }
    catch (error : any) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className='flex justify-between items-center m-3 p-2 text-white'>
        <div className='flex items-center'>
          {/*<DisplayAvatar avatar={props.profile.avatar}/>*/}
          <h1 className='m-3 text-2xl font-bold'>{ props.profile.username }</h1>
        </div>
        <button
          className="p-2 bg-gradient-to-tl m-2 from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white rounded-lg"
          onClick={handleRemove}
          >
          Remove Block
        </button>
      </div>
      <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-violet-900'/>
    </div>
  )
}

export default SingleBlocked
