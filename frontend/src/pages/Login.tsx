import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Logo42 from '../assets/42logo.png';
import loginImg from '../assets/login.jpg';

interface FormValues {
  username: string;
  wordpass: string;
}

function Login() {
  const [formValues, setFormValues] = useState<FormValues>({
    username: '',
    wordpass: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues(prevState => ({ ...prevState, [name]: value }));
  };

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
        alert("Creation failed");
        }
      else {
        console.log(response.token.access_token)
        Cookies.set('access_token', response.token.access_token)
        navigate("/home");
      } 
      });
  };

  const gotoSignUpPage = () => navigate("/signup");


  return (
		<div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
			<div className='hidden sm:block'>
				<img className='w-full h-full object-cover' src={ loginImg } />
			</div>
			<div className='bg-gradient-to-tl from-violet-900 via-slate-900 to-slate-900 flex flex-col justify-center'>
				<form className='max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg shadow-lg shadow-slate-900/30' onSubmit={handleSubmit}>
					<h2 className='text-4xl dark:text-white font-bold text-center'>SIGN IN</h2>
					<div className='flex flex-col text-gray-400 py-2'>
						<label>Username</label>
						<input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
							type='text' name='username' value={formValues.username} onChange={handleInputChange}/>
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
          <button className='w-full my-3 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' onClick={gotoSignUpPage}>Create Account</button>
          <a href="http://localhost:3001/auth/42/login" className='w-full my-3 py-2 bg-gradient-to-tl from-white via-slate-900 to-white shadow-lg shadow-slate-900/30 hover:shadow-white/30 text-white font-semibold rounded-lg'>Sign in with 42</a>
				</form>
			</div>
		</div>
		//<div className='bg-gradient-to-b from-violet-900 via-violet-500 to-blue-800 w-full h-full'>
    //	<form className="form-container bg-gray-20" onSubmit={handleSubmit}>
    //	  <label className='text-gray-200 text-3xl'>
    //	    Username
    //	    <input
    //	      type="text"
    //	      name="username"
    //	      value={formValues.username}
    //	      onChange={handleInputChange}
    //	    />
    //	  </label>
    //	  <br />
    //	  <label className='text-gray-200 text-3xl'>
    //	    Password
    //	    <input
    //	      type="password"
    //	      name="wordpass"
    //	      value={formValues.wordpass}
    //	      onChange={handleInputChange}
    //	    />
    //	  </label>
    //	  <br />
    //	  <button type="submit" className='bg-gray-800 text-gray-200'>Submit</button>
    //	  <div className='pt-4'>
		//			
		//			<button type="button" className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
		//				<svg className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
		//				Sign in with Google
		//			</button>
		//		</div>
		//		<div className='flex items-center gap-10 pt-3 place-content-center'>
		//			<label className='text-gray-200'> Don't have an account?</label>
		//			<button className='bg-gray-800 text-gray-200' onClick={gotoSignUpPage}>Sign up</button>
		//		</div>
    //	</form>
		//</div>
  );
}

export default Login;
