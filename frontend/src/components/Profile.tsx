import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './form.css';

function Profile({ getToken }) {

const [error, setError] = useState(null);
const [isLoaded, setIsLoaded] = useState(false);
const [user, setUser] = useState([]);
  const navigate = useNavigate();

  let userObj = getToken();
  if (!userObj)
    navigate('/');
  else
    useEffect(() => {
        let url = 'http://localhost:3001/user/' + userObj + '/profile'
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              setIsLoaded(true);
              setUser(result);
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
      }, [])

      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return (
          <div>
            <h1>Here are your personal informations :</h1>
            <p>
                Firstname : {user.firstname}
            </p>
            <p>
                Lastname : {user.lastname}
            </p>
            <p>
                Email : {user.email}
            </p>
            <p>
                Age : {user.age}
            </p>
          </div>
        );
      }
}

export default Profile;
