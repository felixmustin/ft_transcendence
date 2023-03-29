import React from 'react'
import Navbar from '../../components/design/Navbar'
import loginImg from '../../assets/login.jpg'
import ProfileData from '../../components/user/ProfileData'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import Loading from '../../components/utils/Loading'
import Error from '../../components/utils/Error'
import DisplayAvatar from '../../components/utils/DisplayAvatar'

type Props = {
  username?: string;
}


const Profile = ({ username }: Props) => {
  // Error management
  const [error, setError] = useState(null);
  // Loading management
  const [isLoaded, setIsLoaded] = useState(false);
  // User data retrieved from the API
  const [profile, setProfile] = useState([]);
  // Navigation
  const navigate = useNavigate();
  // Cookies and auth
  const token = Cookies.get("access_token");
  const auth = 'Bearer ' + token;

  // Fetch user data and handles loading and error.
  // Depending on if the user asked for another user's profile or his own,
  // the API will return different data.
  useEffect(() => {
    const fetchData = async () => {
      const url = username
        ? `http://localhost:3001/user/${username}`
        : 'http://localhost:3001/user/profile';

      try {
        const res = await fetch(url, { method: 'GET', headers: { 'Authorization': auth } });
        const result = await res.json();
        setIsLoaded(true);
        setProfile(result);
      } catch (error) {
        setIsLoaded(true);
        setError(error);
      }
    };

    if (!token) {
      navigate('/');
    } else {
      fetchData();
    }
  }, [token, username, navigate]);

  // This needs to be updated to use the API.
  // Handle the launching of a game
  const handleLaunchGame = async () => {
  };

  // This needs to be updated to use the API.
  // Handle the adding of a friend
  const handleAddFriend = async () => {
    //try {
    //  // Call the API to add the user as a friend
    //  await fetch(`http://localhost:3001/user/add-friend/${profile.id}`, { method: 'POST', headers: { 'Authorization': auth } });
    //  console.log("Friend added successfully");
    //} catch (error) {
    //  console.error("Error adding friend:", error);
    //}
  };

  // This needs to be updated to use the API.
  // Handle the sending of a message to the user
  const handleSendMessage = async () => {
    // Implement sending a message to the user
    //console.log("Sending a message to user:", profile.username);
  };

  if (error) //error
    return <Error item={ error }/>;
  else if (!isLoaded)
    return <Loading />;
  else {
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
            <DisplayAvatar data={profile}/>
              <div className='text-center p-3'>
                <h2 className='text-white text-3xl underline'>{profile.firstname} TITLE</h2>
                {username && (
                  <div className="flex justify-center space-x-4 my-4">
                    <button
                    className="w-[75px] h-[40px] items-center py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white rounded-lg"
                    onClick={handleLaunchGame}
                    >
                    Game
                    </button>
                    <button
                    className="w-[75px] h-[40px] items-center py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white rounded-lg"
                    onClick={handleAddFriend}
                    >
                    Add
                    </button>
                    <button
                      className="w-[75px] h-[40px] items-center py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white rounded-lg"
                      onClick={handleSendMessage}
                    >
                      Message
                    </button>
                  </div>
                )}
              </div>
            </div>
            <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900'/>
            <div className='grid grid-cols-2 justify-center items-center text-center'>
              <ProfileData item={{ field: 'GAMES PLAYED', data: '20' }} />
              <ProfileData item={{ field: 'GAMES WON', data: '11' }} />
              <ProfileData item={{ field: 'ACHIEVEMENTS', data: '5' }} />
              <ProfileData item={{ field: 'RANK', data: '1' }} />
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default Profile