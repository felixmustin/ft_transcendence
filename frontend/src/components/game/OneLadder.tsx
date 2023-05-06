import React from 'react'

type Props = {
  item: { username: string; won: number };
  index: number;
}

const OneLadder = ({ item, index }: Props) => {
  const getBackgroundClassName = () => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-tl from-yellow-400 via-yellow-400 to-white';
      case 1:
        return 'bg-gradient-to-tl from-neutral-400 via-neutral-400 to-white';
      case 2:
        return 'bg-gradient-to-tl from-amber-800 via-amber-800 to-white';
      default:
        return 'bg-violet-700';
    }
  };

  return (
    <div className={`${getBackgroundClassName()} flex m-2 p-2 rounded-lg items-center text-black border border-black font-bold`}>
      <p className=' w-1/5 text-xl mx-3'>{index + 1}</p>
      <p className='w-3/5 text-xl text-center'>{item.username}</p>
      <p className='w-1/5 text-xl text-right mx-3'>{item.won}</p>
    </div>
  )
}

export default OneLadder;
