import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/npinheir/Navbar"
import loginImg from '../assets/login.jpg';
import UserProfileData from '../components/UserProfileData';

function Profile() {

const [error, setError] = useState(null);
const [isLoaded, setIsLoaded] = useState(false);
const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const token = Cookies.get("access_token");
  if (!token)
    navigate('/');
  else
    useEffect(() => {
        let url = 'http://localhost:3001/user/profile'
        let auth = 'Bearer ' + token;
        fetch(url, {method: 'GET', headers: {'Authorization': auth}})
          .then(res => res.json())
          .then(
            (result) => {
              setIsLoaded(true);
              setUser(result);
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
      }, [])

      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return (
			<div className="app bg-gradient-to-tl from-violet-900 via-black to-black w-full overflow-hidden">
            <div className="bg-black flex justify-center items-center px-6 sm:px-16 border-b-2 border-violet-900">
              <div className="xl:max-w-[1280px] w-full">
                <Navbar />
              </div>
            </div>

            <div className='flex justify-evenly'>
              <div className='bg-violet-900 rounded-lg w-[800px] m-5'>
                <div className='flex justify-evenly items-center p-4'>
                  <img className='rounded-full w-[100px] h-[100px]' src={ loginImg }/>
                  <div className='text-white text-3xl text-center underline'>
                    <h2>{user.firstname} TITLE</h2>
                  </div>
                </div>
                <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900'/>
                <div className='grid grid-cols-2 justify-center items-center text-center'>
                <UserProfileData item={{ field: 'GAMES PLAYED', data: '20' }} />
                <UserProfileData item={{ field: 'GAMES WON', data: '11' }} />
                <UserProfileData item={{ field: 'ACHIEVEMENTS', data: '5' }} />
                <UserProfileData item={{ field: 'RANK', data: '1' }} />
                </div>
              </div>
            </div>

          </div>
        );
      }
}

export default Profile;
