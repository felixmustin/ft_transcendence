import React from 'react'
import { ProfileInterface } from '../messages/types'
import DisplayAvatar from '../utils/DisplayAvatar'

type Props = {
  profile: ProfileInterface
}

const SingleBlocked = (props: Props) => {

  const handleRemove = async () => {
    // Remove from block list
  }

  return (
    <div>
      <div className='grid grid-cols- text-center text-white items-center m-3 p-2'>
        {/* <img className='rounded-full h-[50px] w-[50px]' src={ props.avatar.picture }/> */}
        {/*<DisplayAvatar avatar={props.profile.avatar}/>*/}

        <h1>{ props.profile.username }</h1>
        {/* <h1>{ props.item.rank }</h1>
        <h1>{ props.item.status }</h1> */}
        <div>
        </div>
        <button
          className="items-center py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white rounded-lg"
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