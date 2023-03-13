import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './form.css';

function Disconnect({ deleteToken, getToken }) {

  const navigate = useNavigate();
  
  let userObj = getToken();

  const disconnect = () => {
    deleteToken();
    navigate('/');
  };

  const deleteAcc = () => {
    let url = 'http://127.0.0.1:3001/user/' + userObj
    fetch(url, {
      method: 'DELETE',
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
