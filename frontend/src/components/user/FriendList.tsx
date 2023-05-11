import React, { useEffect, useState } from 'react'
import SocialDataFriends from './SocialDataFriends';
import SocialDataRequest from './SocialDataRequest';
import Error from '../../components/utils/Error'
import { ProfileInterface } from '../messages/types';
import SocketContext from '../../context/Socket';

type Props = {
    accessToken: string | undefined;
}

const FriendList = ({accessToken}: Props) => {

    const [error, setError] = useState<Error>();
    const [friends, setFriends] = useState<ProfileInterface[]>([]);
    const [requestList, setRequestList] = useState([]);
    const [change, onChange] = useState(false);

    const auth = 'Bearer ' + accessToken;

    
    const { SocketState, SocketDispatch } = React.useContext(SocketContext);
  useEffect(() => {
    const status_handler = (stat: number[]) => {
      setFriends(prevFriends => prevFriends.map((friend, index) => {
        return {
          ...friend,
          statusid: stat[index]
        };
      }));
    }
    SocketState.socket?.on('status', status_handler);

    const intervalId = setInterval(() => {
      let user:string[] = [];
      for (let i = 0; i < friends.length; i++){
        user.push(friends[i].username);
      }
      SocketState.socket?.emit('get status', user);
    }, 2000);

    // Cleanup function to remove the 'status' event listener
    return () => {
      SocketState.socket?.off('status', status_handler);
      clearInterval(intervalId);
    }
  }, [friends, SocketState.socket]);

    useEffect(() => {
            const fetchFriends = async () => {
              const url = 'http://localhost:3001/friends/get/list/profiles';
              try {
                const res = await fetch(url, { method: 'GET', headers: { 'Authorization': auth } });
                const result = await res.json();
        
                if (res.ok)
                  setFriends(result);
              } catch (error : any) {
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
              } catch (error : any) {
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
                    <SocialDataRequest key={key} request={request} item={{ accessToken: accessToken }} onChange={handleChange}/>
                ))}
            </div>
          </>
        )}
        <div className='w-1/4 text-center bg-violet-700 rounded-lg p-2 m-2'>
          Friends
        </div>
        <div className='bg-violet-700 rounded-lg p-2 m-2'>
            {Object.entries(friends).map(([key, profile]) => (
                <SocialDataFriends key={key} profile={profile} item={{ accessToken: accessToken }} onChange={handleChange}/>
            ))}
        </div>
      </div>
    )
  }
}

export default FriendList
