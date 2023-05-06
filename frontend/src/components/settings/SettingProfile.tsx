import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getSessionsToken } from '../../sessionsUtils';
import DisplayAvatar from '../utils/DisplayAvatar';
import { FaPen } from 'react-icons/fa';


type Props = {
  item: {
    accessToken: string | undefined;
  };
}


const SettingProfile = (props: Props) => {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [profile, setProfile] = useState([]);
    const [updatedProfile, setUpdatedProfile] = useState(null);

    const [newUsername, setNewUsername] = useState('');
    const [editUsername, setEditUsername] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [editEmail, setEditEmail] = useState(false);
    const [newFirstname, setNewFirstname] = useState('');
    const [editFirstname, setEditFirstname] = useState(false);
    const [newLastname, setNewLastname] = useState('');
    const [editLastname, setEditLastname] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
      if (props.item.accessToken) {
        const auth = 'Bearer ' + props.item.accessToken;
        fetch('http://localhost:3001/user/profile', {method: 'GET', headers: {'Authorization': auth}})
          .then(res => res.json())
          .then(
          (result) => {
            if (result.statusCode === 401)
              navigate('/')
            else {
              setIsLoaded(true);
              setProfile(result);
            }
          },
              (error) => {
              setIsLoaded(true);
              setError(error);
          }
          )
        }
        else
          navigate('/')
    }, [props.item.accessToken])


   function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      if (props.item.accessToken) {
        const auth = 'Bearer ' + props.item.accessToken
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
      if (!newUsername)
          return;
      const auth = 'Bearer ' + props.item.accessToken
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
          setEditUsername(false);
      })
      .catch((error) => {
          console.error('Error updating username:', error);
      });
    }

  function handleUpdateEmail() {
    if (!newEmail)
        return;
    const auth = 'Bearer ' + props.item.accessToken

    fetch('http://localhost:3001/user/update/email', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
        },
        body: JSON.stringify({
            email: newEmail
        })
    })
    .then(res => res.json())
    .then((result) => {
        console.log(result);
        setProfile(prevProfile => ({...prevProfile, email: newEmail}));
        setEditEmail(false);
    })
    .catch((error) => {
        console.error('Error updating email:', error);
    });
  }

  function handleUpdateFirstname() {
    if (!newFirstname)
        return;
    const auth = 'Bearer ' + props.item.accessToken
    fetch('http://localhost:3001/user/update/firstname', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
        },
        body: JSON.stringify({
            firstname: newFirstname
        })
    })
    .then(res => res.json())
    .then((result) => {
        console.log(result);
        setProfile(prevProfile => ({...prevProfile, firstname: newFirstname}));
        setEditFirstname(false);
    })
    .catch((error) => {
        console.error('Error updating firstname:', error);
    });
  }

  function handleUpdateLastname() {
    if (!newLastname)
        return;
    const auth = 'Bearer ' + props.item.accessToken

    fetch('http://localhost:3001/user/update/lastname', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
        },
        body: JSON.stringify({
            lastname: newLastname
        })
    })
    .then(res => res.json())
    .then((result) => {
        console.log(result);
        setProfile(prevProfile => ({...prevProfile, lastname: newLastname}));
        setEditLastname(false);
    })
    .catch((error) => {
        console.error('Error updating lastname:', error);
    });
  }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
          return (
              <div className='flex flex-col space-y-4'>
                 <div className='mx-auto'>
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
                  <div className='flex justify-between items-start'>
                    <h1 className="flex items-center"
                        onBlur={() => setEditUsername(false)} > 
                    <span>Username : </span>
                      {editUsername ?
                     
                        <input type="text" 
                          value={newUsername} 
                          onChange={e => setNewUsername(e.target.value)} 
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                                handleUpdateUsername();
                            }
                          }}
                          autoFocus
                        /> :
                        <>
                          <span className="ml-2">{profile.username}</span>
                          <FaPen 
                            className="ml-2 cursor-pointer"
                            onClick={() => setEditUsername(true)}
                          />
                        </>
                      }
                    </h1>
                  </div>

                  <div className='flex justify-between items-start' >
                    <h1 className="flex items-center"
                        onBlur={() => setEditEmail(false)} >
                    <span>Email : </span>
                      {editEmail ?
                        <input type="text" 
                          value={newEmail} 
                          onChange={e => setNewEmail(e.target.value)} 
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                                handleUpdateEmail();
                            }
                          }}
                          autoFocus
                        /> :
                        <>
                           <span className="ml-2">{profile.email}</span>
                           <FaPen 
                            className="ml-2 cursor-pointer"
                            onClick={() => setEditEmail(true)}
                          />
                        </>
                      }
                    </h1>
                 </div>

                 <div className='flex justify-between items-start'>
                    <h1 className="flex items-center"
                        onBlur={() => setEditFirstname(false)} >
                    <span>Firstname : </span>
                      {editFirstname ?
                        <input type="text" 
                          value={newFirstname} 
                          onChange={e => setNewFirstname(e.target.value)} 
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                                handleUpdateFirstname();
                            }
                          }}
                          autoFocus
                        /> :
                        <>
                          <span >{profile.firstname}</span>
                          <FaPen 
                            className="ml-2 cursor-pointer"
                            onClick={() => setEditFirstname(true)}
                          />
                        </>
                      }
                    </h1>
                  </div>

                  <div className='flex justify-between items-start'>
                    <h1 className="flex items-center"
                        onBlur={() => setEditLastname(false)} > 
                    <span>Lastname : </span>
                      {editLastname ?
                        <input type="text" 
                          value={newLastname} 
                          onChange={e => setNewLastname(e.target.value)} 
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                                handleUpdateLastname();
                            }
                          }}
                          autoFocus
                        /> :
                        <>
                          <span >{profile.lastname}</span>
                          <FaPen 
                            className="ml-2 cursor-pointer"
                            onClick={() => setEditLastname(true)}
                          />
                        </>
                      }
                    </h1>
                  </div>
              </div>        
        )
    }
}

export default SettingProfile