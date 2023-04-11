import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getSessionsToken } from '../../sessionsUtils';
import SocialDataFriends from './SocialDataFriends';
import SocialDataRequest from './SocialDataRequest';

import Error from '../../components/utils/Error'

type Props = {}

const FriendList = (props: Props) => {

    const [error, setError] = useState(null);
    // Loading management
    // User data retrieved from the API
    const [friends, setFriends] = useState([]);
    const [requestList, setRequestList] = useState([]);

    const navigate = useNavigate();

    const token = getSessionsToken()
    const auth = 'Bearer ' + token.access_token;

    useEffect(() => {
            const fetchFriends = async () => {
              const url = 'http://localhost:3001/friends/get/list/profiles';
              try {
                const res = await fetch(url, { method: 'GET', headers: { 'Authorization': auth } });
                const result = await res.json();
        
                if (res.ok)
                  setFriends(result);
              } catch (error) {
                setError(error);
              }
            };
            const fetchRequestList = async () => {
              const url = 'http://localhost:3001/friends/get/requests';
              try {
                const res = await fetch(url, { method: 'GET', headers: { 'Authorization': auth } });
                const result = await res.json();
                
                if (res.ok)
                  setRequestList(result);
              } catch (error) {
                setError(error);
              }
            };
        
            if (!token) {
              navigate('/');
            } else {
              fetchFriends();
              fetchRequestList();
            }
          }, [token.access_token]);


  if (error) // error
    return <Error item={ error }/>
  else {
    return (
      <div>
        <div className='w-1/4 text-center bg-violet-700 rounded-lg p-2 m-2'>
          New requests
        </div>
          <div className='bg-violet-700 rounded-lg p-2 m-2'>
            {Object.entries(requestList).map(([key, request]) => (
                  <SocialDataRequest key={key} request={request} />
              ))}
          </div>
        <div className='w-1/4 text-center bg-violet-700 rounded-lg p-2 m-2'>
          Friends
        </div>
        <div className='bg-violet-700 rounded-lg p-2 m-2'>
            {Object.entries(friends).map(([key, profile]) => (
                <SocialDataFriends key={key} profile={profile} />
            ))}
        </div>
      </div>
    )
  }
}

export default FriendList