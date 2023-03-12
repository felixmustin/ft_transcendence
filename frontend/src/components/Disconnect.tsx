import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './form.css';

function Disconnect({ deleteToken, getToken }) {

  const navigate = useNavigate();
  
  let userToken = getToken();

  const disconnect = () => {
    deleteToken();
    navigate('/');
  };

  const deleteAcc = () => {
    let url = 'http://localhost:3001/user/delete/'
    let auth = 'Bearer ' + userToken.access_token;
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
            <button className='link' onClick={disconnect}>
                        Disconnect
            </button>
            <button className='link' onClick={deleteAcc}>
                        Delete Account
            </button>
          </div>
        );
      }

export default Disconnect;
