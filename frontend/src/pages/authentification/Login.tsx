import React from 'react'
import loginImg from '../../assets/login.jpg'
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import TwoFactorAuthentication from '../../components/authentication/TwoFactorAuthentication';
import Loading from '../../components/utils/Loading';
import { setSessionToken, tokenForm } from '../../sessionsUtils';

type Props = {}

// Values that will be sent to the backend
interface FormValues {
  loginName: string;
  wordpass: string;
}

const Login = (props: Props) => {

  // Initializing the values and preparing the functions to handle the form
  const [formValues, setFormValues] = useState<FormValues>({
    loginName: '',
    wordpass: '',
  });

  // Loading management
  // const [isAuthenticated, setAuthentication] = useState(false);
  const [isTwoAuthentication, setIsTwoAuthentication] = useState(false);
  const [token, setToken] = useState<tokenForm>();

  // User for navigation
  const navigate = useNavigate();
  // Function responsible for redirecting the user to the signup page
  const gotoSignUpPage = () => navigate("/signup");

  /*
    Function responsible for updating the values of the form.
    Is triggered when the user types in the input fields.
  */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues(prevState => ({ ...prevState, [name]: value }));
  };

  /*
    Function responsible for sending all login data to the backend,
    and if the login is successful, it will redirect the user to the home page.
    Is triggered when the user clicks on the "Sign In" button.
  */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues),
    }).then(res => res.json()
    ).then(response => {
      if (response.statusCode >= 400) {
        alert(response.message);
        }
      else {
        console.log(response.token)
        if (response.token.twoFaEnabled)
        {
          setIsTwoAuthentication(true)
          setToken(response.token)
        }
        else {
          setSessionToken(response.token)
          navigate("/home");
        }
      } 
      });
  };


  if (isTwoAuthentication)
    return <TwoFactorAuthentication item={token}/>
  else {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
    <div className='hidden sm:block'>
      <img className='w-full h-full object-cover' src={ loginImg } />
    </div>
    <div className='bg-gradient-to-tl from-violet-900 via-slate-900 to-slate-900 flex flex-col justify-center'>
      <form className='max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg shadow-lg shadow-slate-900/30' onSubmit={handleSubmit}>
        <h2 className='text-4xl dark:text-white font-bold text-center'>SIGN IN</h2>
        <div className='flex flex-col text-gray-400 py-2'>
          <label>Login</label>
          <input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
            type='text' name='loginName' value={formValues.loginName} onChange={handleInputChange}/>
        </div>
        <div className='flex flex-col text-gray-400 py-2'>
          <label>Password</label>
          <input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
            type='password' name='wordpass' value={formValues.wordpass} onChange={handleInputChange}/>
        </div>
        <div className='flex justify-between text-gray-400 py-2'>
          <p className='flex items-center'>
            <input className='mr-2' type='checkbox'/> Remember Me
          </p>
          <p>Forgot Password?</p>
        </div>
        <button className='w-full my-3 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' type='submit'>Sign In</button>
        
        <div className='mt-8 text-white py-2'>
            <p className="text-center">Already have an account?</p>
        </div>
        
        <div className='flex justify-between'>
          <button className='w-1/2 my-3 py-2 bg-gradient-to-tl from-white via-slate-900 to-white shadow-lg shadow-slate-900/30 hover:shadow-white/30 text-white font-semibold rounded-lg text-center mr-4' onClick={gotoSignUpPage}>Create Account</button>
          <div className='w-1/2 my-3 py-2 bg-gradient-to-tl from-white via-slate-900 to-white shadow-lg shadow-slate-900/30 hover:shadow-white/30 text-white font-semibold rounded-lg text-center'>
            <a href="http://localhost:3001/auth/42/login">Sign In with 42</a>
          </div>
        </div>
      </form>
    </div>
  </div>
  )
}
}

export default Login