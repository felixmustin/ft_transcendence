import React from 'react'

type Props = {
  title: string
  link: string
}

const Link = ({ title, link }: Props) => {
  return (
    <div>
      <a href={link} className='text-gray-200 text-xl hover:text-gray-50'>
        {title}
      </a>
    </div>
  )
}

export default Link