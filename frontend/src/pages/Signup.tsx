import Cookies from "js-cookie";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImg from '../assets/login.jpg';

interface FormValues {
  username: string;
  wordpass: string;
}

function Signup() {
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

      const response = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      }).then(res => res.json()
      ).then(response => {
          if (response.statusCode >= 400) {
            alert("Creation failed");
          } else {
            Cookies.set('access_token', response.token.access_token)
            navigate("/userinfo");
          }
        });
    };

    
    const gotoLoginPage = () => navigate("/");

    return (
			<div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
			<div className='hidden sm:block'>
				<img className='w-full h-full object-cover' src={ loginImg } />
			</div>
			<div className='bg-gradient-to-tl from-violet-900 via-slate-900 to-slate-900 flex flex-col justify-center'>
				<form className='max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg shadow-lg shadow-slate-900/30' onSubmit={handleSubmit}>
					<h2 className='text-4xl dark:text-white font-bold text-center'>SIGN UP</h2>
					<div className='flex flex-col text-gray-400 py-2'>
						<label>Username</label>
						<input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
							type='text' name='username' value={formValues.username} required onChange={handleInputChange}/>
					</div>
					<div className='flex flex-col text-gray-400 py-2'>
						<label>Password</label>
						<input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
							type='password' name='wordpass' value={formValues.wordpass} minLength={8} required onChange={handleInputChange}/>
					</div>
					<button className='w-full my-3 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' type='submit'>Sign Up</button>
					<button className='w-full my-3 py-2 bg-gradient-to-tl from-white via-slate-900 to-white shadow-lg shadow-slate-900/30 hover:shadow-white/30 text-white font-semibold rounded-lg' type='submit'>Sign Up with 42</button>
          <div className='text-white py-2'>
						<p className="text-center">Already have an account?</p>
					</div>
					<button className='w-full my-3 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' onClick={gotoLoginPage}>Login</button>
				</form>
			</div>
		</div>

        //<div className='form-container'>
        //    <h2>Sign up </h2>
        //    <form className='signup__form' onSubmit={handleSubmit}>
        //        <label htmlFor='username'>Username</label>
        //        <input
        //            type='text'
        //            id='username'
        //            name='username'
        //            value={formValues.username}
        //            required
        //            onChange={handleInputChange}
        //        />
        //        <label htmlFor='password'>Password</label>
        //        <input
        //            type='password'
        //            name='wordpass'
        //            id='wordpass'
        //            minLength={8}
        //            required
        //            value={formValues.wordpass}
        //            onChange={handleInputChange}
        //        />
        //        <button className='signupBtn' >SIGN UP</button>
        //        <p>
        //            Already have an account?{" "}
        //            <button className='link' onClick={gotoLoginPage}>
        //                Login
        //            </button>
        //        </p>
        //    </form>
        //</div>
    );
};

export default Signup;