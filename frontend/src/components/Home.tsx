import Banner from './Banner';
import Login from './Login';
import Signup from './Signup';
import GamePong from './Pong';
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom';
// import { Switch } from 'react-router-dom';

function Home() {
  const buttons = [
    {text: 'pong', link: '/pong'},
    {text: 'signup', link: '/register'},
    {text: 'login', link: '/login'}
  ];
  return (
    <div>
      <Banner title="Welcome to my website!" buttons={buttons} />
      {/* <Router> */}
      <Routes>
        <Route element={<GamePong/>}/>
        <Route element={<Login/>}/>
        <Route element={<Signup/>}/>
    </Routes>
    {/* </Router> */}
    <div>
      <h1 className="underline">Home</h1>
      <p>This is the home page.</p>
    </div>
    </div>
  )
}

export default Home