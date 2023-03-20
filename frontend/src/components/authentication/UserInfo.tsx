import React from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import loginImg from '../../assets/login.jpg'

type Props = {
  item: {
    token: string
  };
}

interface FormValues {
  email: string;
  firstname: string;
  lastname: string;
  age: number;
}

const UserInfo = (props: Props) => {

  const [formValues, setFormValues] = useState<FormValues>({
    email: '',
    firstname: '',
    lastname: '',
    age: 0,
  });
  const navigate = useNavigate();

  const auth = 'Bearer ' + props.item.token;

  useEffect(() => {
    if (!props.item.token)
      navigate('/');
    }, [props.item.token, navigate])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setFormValues(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      await fetch('http://localhost:3001/auth/signup/profile/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': auth,
        },
        body: JSON.stringify(formValues),
      }).then(response => {
          if (response.ok) {
            Cookies.set('access_token', props.item.token)
            navigate('/home');
          } else {
            alert('Creation failed');
          }
        }).catch(error => {
            alert('Creation failed');
          });
    };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
    <div className='hidden sm:block'>
      <img className='w-full h-full object-cover' src={ loginImg } />
    </div>
    <div className='bg-gradient-to-tl from-violet-900 via-slate-900 to-slate-900 flex flex-col justify-center'>
      <form className='max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg shadow-lg shadow-slate-900/30' onSubmit={handleSubmit}>
        <h2 className='text-4xl dark:text-white font-bold text-center'>SIGN UP</h2>
        <div className='flex flex-col text-gray-400 py-2'>
          <label>Email</label>
          <input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
            type='text' name='email' value={formValues.email} required onChange={handleInputChange}/>
        </div>
        <div className='flex flex-col text-gray-400 py-2'>
          <label>First Name</label>
          <input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
            type='text' name='firstname' value={formValues.firstname} required onChange={handleInputChange}/>
        </div>
        <div className='flex flex-col text-gray-400 py-2'>
          <label>Last Name</label>
          <input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
            type='text' name='lastname' value={formValues.lastname} required onChange={handleInputChange}/>
        </div>
        <div className='flex flex-col text-gray-400 py-2'>
          <label>Age</label>
          <input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
            type='number' name='age' value={formValues.age} required onChange={handleInputChange}/>
        </div>
        <button className='w-full my-3 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' type='submit'>Save</button>
      </form>
    </div>
  </div>
  )
}

export default UserInfo