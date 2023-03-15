import Banner from '../components/Banner';
import Login from './Login';
import Signup from './Signup';
import GamePong from '../components/Pong';
import Profile from './Profile';
import Disconnect from '../components/Disconnect';
import React, { useState, useEffect } from 'react';
import { Routes, BrowserRouter as Router, Route, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Article from "../components/npinheir/Article"
import setArticle from "../constants/SetArticle"
import Navbar from "../components/npinheir/Navbar"
// import { Switch } from 'react-router-dom';

function Home() {
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

  const token = Cookies.get("access_token");
  if (!token)
    navigate('/');
  else
    useEffect(() => {
        let url = 'http://localhost:3001/user/id/'
        let auth = 'Bearer ' + token;
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
			<div className="app bg-gradient-to-tl from-violet-900 via-black to-black w-full overflow-hidden">
			<div className="bg-black flex justify-center items-center px-6 sm:px-16 border-b-2 border-violet-900">
			  <div className="xl:max-w-[1280px] w-full">
				<Navbar />
			  </div>
			</div>
	
	
		  <div className="flex justify-evenly">
			<div className="grid grid-cols-2 w-full">
			  {setArticle.map((article, index) => (
				<Article key={index} item={article} />
			  ))}
			</div>
		  </div>
	
		  <div className="flex justify-center items-start px-6 sm:px-16">
			<div className="xl:max-w-[1280px] w-full">
			  Components
			</div>
		  </div>
		</div>
        );
      }

}

export default Home