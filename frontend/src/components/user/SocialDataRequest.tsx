import React from 'react'
import { getSessionsToken } from '../../sessionsUtils';
import DisplayAvatar from '../utils/DisplayAvatar'

type Props = {
  request : {
    avatar: {type: string, data: []}
    date: string;
    username: string;
  };
}

const SocialDataRequest = (props: Props) => {

    const token = getSessionsToken()
    const auth = 'Bearer ' + token.accessToken;

  // This needs to be updated to use the API.
  // Handle the launching of a game
  const handleAccept = async () => {
    const url = 'http://localhost:3001/friends/accept/request';
    try {
        const res = await fetch(url, {
            method: 'POST', 
            headers: { 'Authorization': auth, 'Content-Type': 'application/json'},
            body:JSON.stringify(props.request)
            })
        if (res.ok)
            alert("Request accepted")
    } catch (error) {
        alert(error);
    }
  };

  // This needs to be updated to use the API.
  // Handle the sending of a message to the user
  const handleDecline = () => {
  };

  return (
    <div>
      <div className='grid grid-cols-5 text-center text-white items-center m-3 p-2'>
        {/* <img className='rounded-full h-[50px] w-[50px]' src={ props.avatar.picture }/> */}
        <DisplayAvatar avatar={props.request.avatar}/>

        <h1>{ props.request.username }</h1>
        {/* <h1>{ props.item.rank }</h1>
        <h1>{ props.item.status }</h1> */}
        <div>
        <button
          className="w-[75px] h-[40px] items-center py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white rounded-lg"
          onClick={handleAccept}
          >
          Accept
          </button>
          <button
          className="w-[75px] h-[40px] items-center py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white rounded-lg"
          onClick={handleDecline}
          >
          Decline
          </button>
        </div>
      </div>
      <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-violet-900'/>
    </div>
  )
}

export default SocialDataRequest