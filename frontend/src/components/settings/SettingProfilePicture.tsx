import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';


const SettingProfilePicture = () => {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [profile, setProfile] = useState([]);
    const [updatedProfile, setUpdatedProfile] = useState(null);
    
    const navigate = useNavigate();

    const token = Cookies.get("access_token");
    const auth = 'Bearer ' + token;

    useEffect(() => {
        fetch('http://localhost:3001/user/profile', {method: 'GET', headers: {'Authorization': auth}})
        .then(res => res.json())
        .then(
        (result) => {
            console.log(result)
            setIsLoaded(true);
            setProfile(result);
        },
            (error) => {
            setIsLoaded(true);
            setError(error);
        }
        )
    }, [navigate])


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
        )
    }
}

export default SettingProfilePicture