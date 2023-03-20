import React from 'react'

type Props = {
  item: {
    picture: string;
    username: string;
    rank: number;
    status: number;
  };
}

const SocialData = (props: Props) => {

  // This needs to be updated to use the API.
  // Handle the launching of a game
  const handleLaunchGame = () => {
  };

  // This needs to be updated to use the API.
  // Handle the sending of a message to the user
  const handleMessage = () => {
  };

  return (
    <div>
      <div className='grid grid-cols-5 text-center text-white items-center m-3 p-2'>
        <img className='rounded-full h-[50px] w-[50px]' src={ props.item.picture }/>
        <h1>{ props.item.username }</h1>
        <h1>{ props.item.rank }</h1>
        <h1>{ props.item.status }</h1>
        <div>
        <button
          className="w-[75px] h-[40px] items-center py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white rounded-lg"
          onClick={handleLaunchGame}
          >
          Game
          </button>
          <button
          className="w-[75px] h-[40px] items-center py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white rounded-lg"
          onClick={handleMessage}
          >
          Message
          </button>
        </div>
      </div>
      <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-violet-900'/>
    </div>
  )
}

export default SocialData