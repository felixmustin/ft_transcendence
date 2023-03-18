import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/npinheir/Navbar"
import loginImg from '../assets/login.jpg';
import UserProfileData from '../components/UserProfileData';
import { Buffer } from 'buffer';


function Profile() {

const [error, setError] = useState(null);
const [isLoaded, setIsLoaded] = useState(false);
const [profile, setProfile] = useState([]);
const [updatedProfile, setUpdatedProfile] = useState(null);

  const navigate = useNavigate();

  const token = Cookies.get("access_token");
  const auth = 'Bearer ' + token;

  useEffect(() => {
    if (!token)
      navigate('/');
    else {
      fetch('http://localhost:3001/user/profile', {method: 'GET', headers: {'Authorization': auth}})
        .then(res => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setProfile(result);
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }
  }, [token, navigate])

  function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      if (token) {
        fetch("http://localhost:3001/user/profiles/avatar", {
          method: "POST",
          headers: {
            Authorization: auth,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Avatar uploaded successfully:", data);
            setUpdatedProfile(data);
          })
          .catch((error) => {
            console.error("Failed to upload avatar:", error);
          });
      }
    }
  }

  useEffect(() => {
    if (updatedProfile) {
      setProfile(updatedProfile);
      setUpdatedProfile(null); // reset updatedUser state
    }
  }, [updatedProfile])


      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        const img = Buffer.from(profile.avatar.data).toString('base64')
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
                    <h2>{profile.firstname} TITLE</h2>
                  </div>
                    <p className='relative'>
                      {profile.avatar && (
                        <img
                          src={`data:image/png;base64,${img}`}
                          alt="User Avatar"
                          className="rounded-full w-[100px] h-[100px]"
                        />
                      )}
                      <label
                        htmlFor='avatar'
                        className="absolute inset-0 cursor-pointer"
                      >
                        {profile.avatar ? 'Change Avatar' : 'Upload Avatar'}
                      </label>
                      <input
                        type='file'
                        name='avatar'
                        id='avatar'
                        accept='.png'
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </p>
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
