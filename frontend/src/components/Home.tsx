import Banner from './Banner';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import GamePong from './Pong';
import Profile from './Profile';
import Disconnect from './Disconnect';
import React, { useState, useEffect } from 'react';
import { Routes, BrowserRouter as Router, Route, useNavigate } from 'react-router-dom';
// import { Switch } from 'react-router-dom';

function Home({ getToken }) {
  const buttons = [
    {text: 'pong', link: '/pong'},
    // {text: 'signup', link: '/signup'},
    // {text: 'login', link: '/login'},
    {text: 'profile', link: '/profile'},
    {text: 'disconnect', link: '/disconnect'},
  ];

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  let userToken = getToken();
  if (!userToken)
    navigate('/');
  else
    useEffect(() => {
        let url = 'http://localhost:3001/user/id/'
        let auth = 'Bearer ' + userToken.access_token;
        fetch(url, {method: 'GET', headers: {'Authorization': auth}})
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
          <p>Logged in as {user.username}</p>
        <div>
          <Banner title="Welcome to my website!" buttons={buttons} />
          {/* <Router> */}
          <Routes>
            <Route element={<GamePong/>}/>
            {/* <Route element={<Login/>}/> */}
            {/* <Route element={<Signup/>}/> */}
            <Route element={<Profile/>}/>
            <Route element={<Disconnect/>}/>
        </Routes>
        {/* </Router> */}
        <div>
          <h1 className="underline">Home</h1>
          <p>This is the home page.</p>
        </div>
        </div>
        </div>
        );
      }

}

export default Home