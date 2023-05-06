import React from 'react'
import Navbar from '../../components/design/Navbar'
import loginImg from '../../assets/login.jpg'
import ProfileData from '../../components/user/ProfileData'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from '../../components/utils/Loading'
import Error from '../../components/utils/Error'
import DisplayAvatar from '../../components/utils/DisplayAvatar'
import { getSessionsToken } from '../../sessionsUtils'
import { tokenForm } from '../../interfaceUtils'
import { ProfileInterface } from '../../components/messages/types'
import MatchHistory from '../../components/user/MatchHistory'

interface FlexData {
  played: number;
  won: number;
  stomp: number;
  rank: number;
}

type Props = {
  username?: string;
}

const Profile = ({ username }: Props) => {
  // Error management
  const [error, setError] = useState(null);
  // Loading management
  const [isLoaded, setIsLoaded] = useState(false);
  // User data retrieved from the API
  const [profile, setProfile] = useState<ProfileInterface>();
  const [token, setToken] = useState<tokenForm>();
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [flexData, setFlexData] = useState<FlexData>();


  // Navigation
  const navigate = useNavigate();
  // Session and auth
  useEffect(() => {
    async function getToken() {
      const sessionToken = await getSessionsToken();
      if (!sessionToken)
        navigate('/')
      setToken(sessionToken);
      setIsTokenSet(true)
    }
    getToken();
  }, []);


  // Fetch user data and handles loading and error.
  // Depending on if the user asked for another user's profile or his own,
  // the API will return different data.
  useEffect(() => {
    const fetchData = async () => {
      const auth = 'Bearer ' + token.accessToken;
      const url = username
        ? `http://localhost:3001/user/profile/${username}`
        : 'http://localhost:3001/user/profile';

      try {
        const res = await fetch(url, { method: 'GET', headers: { 'Authorization': auth } });
        const result = await res.json();
        if (result.statusCode === 401)
              navigate('/');
        else {
          setIsLoaded(true);
          setProfile(result);
        }
      } catch (error) {
        setIsLoaded(true);
        setError(error);
      }
    };

    if (isTokenSet) {
      if (!token) {
        navigate('/');
      } else {
        fetchData();
      }
    }
  }, [isTokenSet, username]);


  // Fetch user flex data
  useEffect(() => {
    const fetchFlexData = async () => {
      if (!token) {
        return;
      }
      const auth = 'Bearer ' + token.accessToken;
      const url = username
        ? `http://localhost:3001/user/profile/flex/${username}`
        : 'http://localhost:3001/user/profile/flex';
      try {
        const response = await fetch(url, { method: 'GET', headers: { 'Authorization': auth } });
        const data = await response.json();
        setFlexData(data);
      } catch (error) {
        console.error('Error fetching the conversation:', error);
      }
    };
    fetchFlexData();
  }, [profile?.id, token, username]);


  // This needs to be updated to use the API.
  // Handle the launching of a game
  const handleLaunchGame = async () => {
    navigate
  };

  const handleBlockUser = async () => {
    //try {
    //  const auth = 'Bearer ' + token.accessToken;
    // // Call the API to add the user as a friend
    // const res = await fetch(`http://localhost:3001/user/${profile.id}/block`, { method: 'POST', headers: {
    //  'Authorization': auth,
    //  },});
    //  if (res.ok)
    //    alert("User blocked");
    //  else if (res.status == 400)
    //    alert("User already blocked")
    //} catch (error) {
    // console.error("Error blocking user:", error);
    //}
  };

  // This needs to be updated to use the API.
  // Handle the adding of a friend
  const handleAddFriend = async () => {
    try {
      const auth = 'Bearer ' + token.accessToken;
     // Call the API to add the user as a friend
     const res = await fetch(`http://localhost:3001/friends/send/request`, { method: 'POST', headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
      },
      body:JSON.stringify({username})});
      if (res.ok)
        alert("Friends request sent");
      else if (res.status == 400)
        alert("You are already friends with this player, or already sent a request")
    } catch (error) {
     console.error("Error sending friend request:", error);
    }
  };

  // This needs to be updated to use the API.
  // Handle the sending of a message to the user
  const handleSendMessage = async () => {
    try {
      const auth = 'Bearer ' + token.accessToken;
      const res = await fetch(`http://localhost:3001/chatroom/create/${profile.id}`, {
        method: 'POST',
        headers: {
          'Authorization': auth,
        },
      });
  
      if (res.ok) {
        const chatRoom = await res.json();
        navigate(`/chatpage/`);
      } else {
        console.error("Error creating chat room:", res.statusText);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
            <Navbar item={token}/>
          </div>
        </div>

        <div className='flex justify-evenly'>
          <div className='bg-violet-900 rounded-lg w-[800px] m-5'>
            <div className='flex justify-evenly items-center p-4'>
            <DisplayAvatar avatar={profile?.avatar}/>
              <div className='text-center p-3'>
                <h2 className='text-white text-3xl underline'>{profile?.username}</h2>
                <h2 className='text-white text-2xl underline'>{profile?.firstname} {profile?.lastname}</h2>
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
                    <button
                    className="w-[75px] h-[40px] items-center py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white rounded-lg"
                    onClick={handleBlockUser}
                    >
                    Block
                    </button>
                  </div>
                )}
              </div>
            </div>
            <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900'/>
            <div className='grid grid-cols-2 justify-center items-center text-center'>
              <ProfileData item={{ field: 'GAMES PLAYED', data: flexData?.played }} />
              <ProfileData item={{ field: 'GAMES WON', data: flexData?.won }} />
              <ProfileData item={{ field: 'STOMPS', data: flexData?.stomp }} />
              <ProfileData item={{ field: 'RANK', data: flexData?.rank }} />
            </div>
            <hr className="w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900" />
            <div>
              <MatchHistory games={profile?.games} currentId={profile?.id}/>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default Profile
