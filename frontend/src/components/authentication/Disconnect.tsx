import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { removeSessionsToken } from '../../sessionsUtils';
import Loading from '../utils/Loading';
import { tokenForm } from '../../interfaceUtils';

type Props = {
  item: tokenForm | undefined;
}

const Disconnect = (props: Props) => {

  // Navigation
  const navigate = useNavigate();

  const disconnect = () => {
    let url = 'http://localhost:3001/user/disconnect/'
    let auth = 'Bearer ' + props.item?.accessToken;
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
    let auth = 'Bearer ' + props.item?.accessToken;
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
      <div className="flex flex-col absolute right-0 mt-2 py-2">
        <button className='link' onClick={disconnect}>Disconnect</button>
        <button className='link' onClick={deleteAcc}>Delete Account</button>
    </div>
    )
  }

export default Disconnect