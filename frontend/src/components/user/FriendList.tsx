import React, { useEffect, useState } from 'react'
import SocialDataFriends from './SocialDataFriends';
import SocialDataRequest from './SocialDataRequest';
import Error from '../../components/utils/Error'

type Props = {
  item: {
    accessToken: string;
  };
}

const FriendList = (props: Props) => {

    const [error, setError] = useState(null);
    const [friends, setFriends] = useState([]);
    const [requestList, setRequestList] = useState([]);
    const [change, onChange] = useState(false);

    const auth = 'Bearer ' + props.item.accessToken;

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
        
            // if (!token) {
            //   navigate('/');
            // } else {
              fetchFriends();
              fetchRequestList();
            // }
          }, [change]);

    const handleChange = () => {
      if (change)
        onChange(false)
      else
        onChange(true)
    };


  if (error) // error
    return <Error item={ error }/>
  else {
    return (
      <div>
        {requestList.length > 0 && (
          <>
            <div className='w-1/4 text-center bg-violet-700 rounded-lg p-2 m-2'>
              New requests
            </div>
            <div className='bg-violet-700 rounded-lg p-2 m-2'>
              {Object.entries(requestList).map(([key, request]) => (
                    <SocialDataRequest key={key} request={request} item={{ accessToken: props.item.accessToken }} onChange={handleChange}/>
                ))}
            </div>
          </>
        )}
        <div className='w-1/4 text-center bg-violet-700 rounded-lg p-2 m-2'>
          Friends
        </div>
        <div className='bg-violet-700 rounded-lg p-2 m-2'>
            {Object.entries(friends).map(([key, profile]) => (
                <SocialDataFriends key={key} profile={profile} item={{ accessToken: props.item.accessToken }} onChange={handleChange}/>
            ))}
        </div>
      </div>
    )
  }
}

export default FriendList
