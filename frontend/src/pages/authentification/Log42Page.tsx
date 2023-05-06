import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState } from 'react';
import loginImg from '../../assets/login.jpg'
import { setSessionToken } from '../../sessionsUtils';
import { UsernameInput, tokenForm } from '../../interfaceUtils';
import TwoFactorAuthentication from '../../components/authentication/TwoFactorAuthentication';

const Log42Page = () => {

  // Initialize form values
  const [UsernameInput, setUsernameInput] = useState<UsernameInput>({
    username: '',
  });
  // const cst = true;
  const [is2FA, setIs2FA] = useState(false);
  const [token2FA, setToken2FA] = useState('');
  const [token, setToken] = useState<tokenForm>();
  const [needUsername, setNeedUsername] = useState(false);

  // Handle navigation
  const navigate = useNavigate();

  // Because the user coming to this page has the cookies, it must be removed and set in session when valid username is set
  useEffect(() => {

    
    const tok = Cookies.get("token");

    if (tok) {
      const parseTok = JSON.parse(tok)

      const fetchProfile = async () => {
        const url = 'http://localhost:3001/user/profile';
        const auth = 'Bearer ' + parseTok.accessToken;

          await fetch(url, { method: 'GET', headers: { 'Authorization': auth } 
        }).then(res => res.json()
        ).then(response => {
            if (response.statusCode >= 400) {
              alert(response.message);
              navigate("/");
            } else {
              const usernameTmp = "Default" + response.id;
              if (response.username != usernameTmp && response.username != null) {
                setSessionToken(parseTok)
                Cookies.remove("token");
                navigate('/play')
              }
              else 
                setNeedUsername(true)
            }})
        };

      if (parseTok.access2FAToken) {
        setIs2FA(true)
        setToken2FA(parseTok.access2FAToken)
      }
      else {
        setIs2FA(false)
        setToken(parseTok);
        fetchProfile();
      }
    }
    else{
      navigate('/');
    }

  }, []); // Run only once on mount

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setUsernameInput(prevState => ({ ...prevState, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await fetch('http://localhost:3001/auth/42/signup', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token?.accessToken}`
      },
      body: JSON.stringify(UsernameInput),
    }).then(res => res.json()
    ).then(response => {
        if (response.statusCode >= 400) {
          alert(response.message);
          navigate("/");
        } else {
          setSessionToken(token)
          Cookies.remove("token");
          navigate("/play");
        }
      });
  };

    return (
      <div>
        <div>
        {is2FA ? 
          <div> 
            <TwoFactorAuthentication item={token2FA}/> 
          </div> 
          : needUsername ?
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
                    type='text' name='username' value={UsernameInput.username} onChange={handleInputChange}/>
                </div>
                <button className='w-full my-3 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' type='submit'>Sign In</button>
              </form>
            </div>
          </div>
          :
          null}
        </div>
      </div>
    )
}


export default Log42Page