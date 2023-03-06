import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import GamePong from './pong.js';
console.log(GamePong);


class Index extends React.Component {
	constructor (props) {
		super (props);
		this.state = {
			logged: 0,
		};
	}
	
	

	render () {
		if (this.state.logged == 0)
			return  <Login />;
		else {
			return <GamePong />;
		}
	}
}

function Login() {
  useEffect(() => {
    // Add event listeners for keydown and keyup events
    document.addEventListener('submit', handleForm);
    
    return () => {
      document.removeEventListener('submit', handleForm);
    };
  }, []);
  
  function handleForm(event) {
    event.preventDefault(); // prevent the form from submitting normally

    const form = document.getElementById('login-form');
    const formData = new FormData(form);
    const url = 'localhost:3001/user/create'; // replace with your own URL
    
    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        alert('Login successful');
        // do something here after login success
      } else {
        alert('Login failed');
        // do something here after login failure
      }
    })
    .catch(error => {
      alert('An error occurred: ' + error.message);
      // do something here after an error occurs
    });
  }
  
  return (
    <div className="container">
      <form className="login-form" id="login-form">
        <h2>Login</h2>
        <label>
          Username:
          <input type="text" name="username" placeholder="Enter your username" />
        </label>
        <label>
          Password:
          <input type="password" name="password" placeholder="Enter your password" />
        </label>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;


// export default Login;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Index />);