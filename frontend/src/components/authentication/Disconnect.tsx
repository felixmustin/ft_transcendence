import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getSessionsToken, removeSessionsToken } from '../../sessionsUtils';
import Loading from '../utils/Loading';
import { tokenForm } from '../../interfaceUtils';

type Props = {}

const Disconnect = (props: Props) => {

  const [token, setToken] = useState<tokenForm>();
  const [isTokenSet, setIsTokenSet] = useState(false);

  // Navigation
  const navigate = useNavigate();
  // Session and auth
  useEffect(() => {
    async function getToken() {
      const sessionToken = await getSessionsToken();
      setToken(sessionToken);
      setIsTokenSet(true)
    }
    getToken();
  }, []);

  const disconnect = () => {
    let url = 'http://localhost:3001/user/disconnect/'
    let auth = 'Bearer ' + token.accessToken;
    fetch(url, {
      method: 'PUT',
      headers: {'Authorization': auth}
    }).then(response => {
      if (!response.ok)
        alert("Disconnection of user failed");
      else {
        removeSessionsToken()
        navigate('/');
      } 
    });
  };

  const deleteAcc = () => {
    let url = 'http://localhost:3001/user/delete/'
    let auth = 'Bearer ' + token.accessToken;
    fetch(url, {
      method: 'DELETE',
      headers: {'Authorization': auth}
    }).then(response => {
      if (!response.ok)
        alert("Deletion of user failed");
      else {
        fetch('http://localhost:3001/friends/delete/user', {
          method: 'DELETE',
          headers: {'Authorization': auth}
        }).then(response => {
          if (response.ok)
            disconnect();
          else { 
            alert("Deletion of friends failed");
          }
        });
      } 
    });
  }

  if (!isTokenSet)
    return <Loading />
  else 
  {
    return (
      <div className="flex flex-col absolute right-0 mt-2 py-2">
        <button className='link' onClick={disconnect}>Disconnect</button>
        <button className='link' onClick={deleteAcc}>Delete Account</button>
    </div>
    )
  }
}

export default Disconnect