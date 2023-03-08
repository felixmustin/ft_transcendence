import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";


interface FormValues {
  username: string;
  wordpass: string;
}

function Login() {
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
    // console.log('Submit button clicked');
    // console.log(JSON.stringify(formValues));
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();

      navigate("/home");
      console.log('Response:', data);
    } catch (error) {
      alert('Login successful');
    }
  };

  const gotoSignUpPage = () => navigate("/register");


  return (
    <form onSubmit={handleSubmit}>
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
                    <span className='link' onClick={gotoSignUpPage}>
                        Sign up
                    </span>
                </p>
    </form>

  );
}

export default Login;
