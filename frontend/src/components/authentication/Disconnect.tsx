import React from 'react'
import { useNavigate } from 'react-router-dom';
import { getSessionsToken, removeSessionsToken } from '../../sessionsUtils';

type Props = {}

const Disconnect = (props: Props) => {

  const navigate = useNavigate();
  const token = getSessionsToken()

  const disconnect = () => {
    removeSessionsToken()
    navigate('/');
  };

  const deleteAcc = () => {
    let url = 'http://localhost:3001/user/delete/'
    let auth = 'Bearer ' + token.access_token;
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

  return (
    <div>
      <button className='link' onClick={disconnect}>Disconnect</button>
      <button className='link' onClick={deleteAcc}>Delete Account</button>
  </div>
  )
}

export default Disconnect