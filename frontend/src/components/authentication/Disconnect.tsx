import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { removeSessionsToken } from '../../sessionsUtils';


type Props = {
  accessToken: string;
}

const Disconnect = (props: Props) => {

  // Navigation
  const navigate = useNavigate();

  const disconnect = () => {
    let url = 'http://localhost:3001/user/disconnect/'
    let auth = 'Bearer ' + props.accessToken;
    fetch(url, {
      method: 'PUT',
      headers: {'Authorization': auth}
    }).then(response => {
      if (!response.ok)
        alert("Disconnection of user failed");
      else {
        removeSessionsToken()
        navigate('/');
        window.location.reload();
      } 
    });
  };

  const deleteAcc = () => {
    let url = 'http://localhost:3001/user/delete/'
    let auth = 'Bearer ' + props.accessToken;
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
      <div className="flex flex-col absolute right-0 mt-2 py-2 z-50">
        <button className='link w-[150px] py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' onClick={disconnect}>Disconnect</button>
        <button className='link w-[150px] py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' onClick={deleteAcc}>Delete Account</button>
      </div>
    )
  }

export default Disconnect