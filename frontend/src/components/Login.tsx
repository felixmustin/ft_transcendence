import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './form.css';

interface FormValues {
  username: string;
  wordpass: string;
}

function Login({ setToken }) {
  const [formValues, setFormValues] = useState<FormValues>({
    username: '',
    wordpass: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('http://127.0.0.1:3001/auth/login', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues),
    }).then(res => res.json()
    ).then(response => {
      if (response.statusCode >= 400) {
        alert("Creation failed");
        }
      else {
        setToken(response.token.id);
        navigate("/home");
      } 
      });
  };

  const gotoSignUpPage = () => navigate("/signup");


  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formValues.username}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label className='text-3xl '>
        Password:
        <input
          type="password"
          name="wordpass"
          value={formValues.wordpass}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
      <p>
                    Don't have an account?{" "}
                    <button className='link' onClick={gotoSignUpPage}>
                        Sign up
                    </button>
                </p>
    </form>

  );
}

export default Login;
