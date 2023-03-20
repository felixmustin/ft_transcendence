import React from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

type Props = {}

const Disconnect = (props: Props) => {

  const navigate = useNavigate();
  const token = Cookies.get("access_token");

  const disconnect = () => {
    Cookies.remove("access_token")
    // deleteToken();
    navigate('/');
  };

  const deleteAcc = () => {
    let url = 'http://localhost:3001/user/delete/'
    let auth = 'Bearer ' + token;
    fetch(url, {
      method: 'DELETE',
      headers: {'Authorization': auth}
    }).then(res => res.json()
    ).then(response => {
      if (response.statusCode >= 400) {
        alert("Deletion failed");
        }
      else {
        disconnect();
      } 
      });
  };


  return (
    <div>
      <button className='link' onClick={disconnect}>Disconnect</button>
      <button className='link' onClick={deleteAcc}>Delete Account</button>
  </div>
  )
}

export default Disconnect