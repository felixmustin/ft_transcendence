import React, { useEffect, useState } from 'react'
import { ProfileInterface } from '../messages/types';
import SingleBlocked from './SingleBlocked';

type Props = {
  accessToken: string | undefined;
}

const BlockedUsers = (props: Props) => {

  const [Error, setError] = useState<Error | null>();
  const [blocked, setBlocked] = useState<ProfileInterface[]>([]);

  useEffect(() => {
    const fetchBlocked = async () => {
      const url = 'http://localhost:3001/user/blocked';
      const auth = 'Bearer ' + props.accessToken;
      try {
        const res = await fetch(url, { method: 'GET', headers: { 'Authorization': auth } });
        const result = await res.json();
        console.log(result);
        if (res.ok)
          setBlocked(result);
      } catch (error : any) {
        setError(error);
      }
    }
    fetchBlocked();
  }, [props.accessToken]);

  return (
    <div>
      <div className='w-1/4 text-center bg-violet-700 rounded-lg p-2 m-2'>
        Blocked
      </div>
      <div className='bg-violet-700 rounded-lg p-2 m-2'>
          {Object.entries(blocked).map(([key, profile]) => (
              <SingleBlocked key={key} profile={profile} token={props.accessToken} />
          ))}
      </div>
    </div>
  )
}

export default BlockedUsers