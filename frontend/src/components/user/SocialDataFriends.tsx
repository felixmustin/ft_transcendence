import React from 'react'
import { getSessionsToken } from '../../sessionsUtils';
import DisplayAvatar from '../utils/DisplayAvatar'

type Props = {
  profile : {
    id: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    age: number;
    avatar: {type: string, data: []}
  };
}

const SocialDataFriends = (props: Props) => {

  const token = getSessionsToken()
  const auth = 'Bearer ' + token.access_token;
  // This needs to be updated to use the API.
  // Handle the launching of a game
  const handleLaunchGame = () => {
  };

  // This needs to be updated to use the API.
  // Handle the sending of a message to the user
  const handleMessage = () => {
  };

  const handleRemove = async () => {
    const url = `http://localhost:3001/friends/delete/${props.profile.username}`;
    try {
        const res = await fetch(url, {
            method: 'DELETE', 
            headers: { 'Authorization': auth },
            })
        if (res.ok)
            alert("Friendship deleted")
    } catch (error) {
        alert(error);
    }
  };

  return (
    <div>
      <div className='grid grid-cols-5 text-center text-white items-center m-3 p-2'>
        {/* <img className='rounded-full h-[50px] w-[50px]' src={ props.avatar.picture }/> */}
        <DisplayAvatar avatar={props.profile.avatar}/>

        <h1>{ props.profile.username }</h1>
        {/* <h1>{ props.item.rank }</h1>
        <h1>{ props.item.status }</h1> */}
        <div>
        <button
          className="items-center py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white rounded-lg"
          onClick={handleLaunchGame}
          >
          Game
          </button>
          <button
          className="items-center py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white rounded-lg"
          onClick={handleMessage}
          >
          Message
          </button>
        </div>
        <button
          className="items-center py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white rounded-lg"
          onClick={handleRemove}
          >
          Remove friends
          </button>
      </div>
      <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-violet-900'/>
    </div>
  )
}

export default SocialDataFriends