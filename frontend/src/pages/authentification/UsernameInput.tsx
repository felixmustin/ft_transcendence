import React from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState } from 'react';
import loginImg from '../../assets/login.jpg'

type Props = {}

interface FormValues {
  username: string;
}

const UsernameInput = (props: Props) => {

  // Initialize form values
  const [formValues, setFormValues] = useState<FormValues>({
    username: '',
  });
  // Handle navigation
  const navigate = useNavigate();
  // Handle cookies and auth
  const token = Cookies.get("access_token");

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues(prevState => ({ ...prevState, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await fetch('http://localhost:3001/auth/42/signup', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formValues),
    }).then(response => {
      if (response.ok) {
        navigate("/home");
      } else {
        alert('Creation failed');
      }
      });
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
      <div className='hidden sm:block'>
        <img className='w-full h-full object-cover' src={ loginImg } />
      </div>
      <div className='bg-gradient-to-tl from-violet-900 via-slate-900 to-slate-900 flex flex-col justify-center'>
        <form className='max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg shadow-lg shadow-slate-900/30' onSubmit={handleSubmit}>
          <h2 className='text-4xl dark:text-white font-bold text-center'>Choose a username</h2>
          <div className='flex flex-col text-gray-400 py-2'>
            <label>Username</label>
            <input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
              type='text' name='username' value={formValues.username} onChange={handleInputChange}/>
          </div>
          <button className='w-full my-3 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' type='submit'>Sign In</button>
        </form>
      </div>
    </div>
  )
}

export default UsernameInput