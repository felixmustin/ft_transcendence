import React from 'react'

type Props = {
  item: {
    image: string;
    title: string;
    description: string;
  };
};

const Article = (props: Props) => {
  return (
    <div className='max-w-[400px] w-full mx-auto bg-violet-900 rounded-lg shadow-lg shadow-slate-900/30 m-5'>
      <img className='rounded-t-lg w-full h-48' src={props.item.image} />
    <div className='p-5 text-white'>
      <h2 className='text-2xl'>{props.item.title}</h2>
      <p>{props.item.description}</p>
    </div>
  </div>
  )
}

export default Article