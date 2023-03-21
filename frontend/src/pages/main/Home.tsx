import React from 'react'
import Navbar from '../../components/design/Navbar'
import Article from '../../components/design/Article'
import setArticle from '../../constants/SetArticle'
import Error from '../../components/utils/Error'
import Loading from '../../components/utils/Loading'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie';

type Props = {}

const Home = (props: Props) => {

  // Error management
  const [error, setError] = useState(null);
  // Loading management
  const [isLoaded, setIsLoaded] = useState(false);
  // User data retrieved from the API
  const [user, setUser] = useState([]);
  // Navigation
  const navigate = useNavigate();
  // Cookies and auth
  const token = Cookies.get("access_token");
  const auth = 'Bearer ' + token;

  // Fetch user data and handles loading and error.
  useEffect(() => {
    if (!token) // '!'token
      navigate('/');
    else {
      fetch('http://localhost:3001/user/id/', {method: 'GET', headers: {'Authorization': auth}})
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
    }
  }, [token, navigate])


  if (error) // error
    return <Error item={ error }/>
  else if (!isLoaded) // '!'isLoaded
    return <Loading />
  else {
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
    )
  }
}

export default Home