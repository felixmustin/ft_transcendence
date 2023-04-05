import React, { useState } from 'react'

type Props = {
  roomId: number;
}

const SendMessage = ({ roomId }: Props) => {

  const [message, setMessage] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    setMessage(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(message);
    // send to backend
    setMessage('');
  };

  return (
    <div className='h-10'>
      <form className='containerWrap flex' onSubmit={handleSubmit}>
        <input className='rounded-lg bg-gray-600 focus:border-blue-500 focus:bg-gray-800 focus:outline-none w-5/6 h-10 px-2'
          type='text' placeholder='Send a message...' value={message} onChange={handleInputChange}/>
        <button className='bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 w-1/6 h-10 px-3 rounded-lg mx-2' type='submit'>Send</button>
      </form>
    </div>
  )
}

export default SendMessage