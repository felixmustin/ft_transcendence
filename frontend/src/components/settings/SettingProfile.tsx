import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getSessionsToken } from '../../sessionsUtils';
import DisplayAvatar from '../utils/DisplayAvatar';


const SettingProfile = () => {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [profile, setProfile] = useState([]);
    const [updatedProfile, setUpdatedProfile] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const [editable, setEditable] = useState(false);

    const navigate = useNavigate();

    const token = getSessionsToken()
    const auth = 'Bearer ' + token.access_token;

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

    function handleUpdateUsername() {
      if (!newUsername) {
          return;
      }

      fetch('http://localhost:3001/user/update/username', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': auth
          },
          body: JSON.stringify({
              username: newUsername
          })
      })
      .then(res => res.json())
      .then((result) => {
          console.log(result);
          setProfile(prevProfile => ({...prevProfile, username: newUsername}));
          setEditable(false);
      })
      .catch((error) => {
          console.error('Error updating username:', error);
      });
  }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
          return (
               <div>

                  <div className='text-center mx-auto'>
                    <h1>
                      {editable ?
                        <input 
                          type="text" 
                          value={newUsername} 
                          onChange={e => setNewUsername(e.target.value)} 
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                                handleUpdateUsername();
                            }
                          }}
                          onBlur={() => setEditable(false)}
                        /> :
                        <>
                          {profile.username}
                          <button onClick={() => setEditable(true)}>Edit</button>
                        </>
                      }
                    </h1>
                 </div>

                <DisplayAvatar avatar={profile.avatar}/>
                <label
                  htmlFor='avatar'
                  className="relative inset-0 cursor-pointer">
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
              </div>        
        )
    }
}

export default SettingProfile