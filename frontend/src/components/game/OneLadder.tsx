import React from 'react'

type Props = {
  item: { username: string; won: number };
  index: number;
}

const OneLadder = ({ item, index }: Props) => {
  const getBackgroundClassName = () => {
    switch (index) {
      case 0:
        return 'bg-yellow-400';
      case 1:
        return 'bg-neutral-400';
      case 2:
        return 'bg-amber-800';
      default:
        return 'bg-violet-700';
    }
  };

  return (
    <div className={`${getBackgroundClassName()} flex m-2 p-2 rounded-lg items-center`}>
      <p className=' w-1/5 text-xl mx-3'>{index + 1}</p>
      <p className='w-3/5 text-xl text-center'>{item.username}</p>
      <p className='w-1/5 text-xl text-right mx-3'>{item.won}</p>
    </div>
  )
}

export default OneLadder;
