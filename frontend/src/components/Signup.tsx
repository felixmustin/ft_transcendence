import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './form.css';

interface FormValues {
  username: string;
  wordpass: string;
}

function Signup({ setToken }) {
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

      const response = await fetch('http://127.0.0.1:3001/auth/signup', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      }).then(res => res.json()
      ).then(response => {
          if (response.statusCode >= 400) {
            alert("Creation failed");
          } else {
            setToken(response.token.id);
            navigate("/userinfo");
          }
        });
    };

    
    const gotoLoginPage = () => navigate("/login");

    return (
        <div className='form-container'>
            <h2>Sign up </h2>
            <form className='signup__form' onSubmit={handleSubmit}>
                <label htmlFor='username'>Username</label>
                <input
                    type='text'
                    id='username'
                    name='username'
                    value={formValues.username}
                    required
                    onChange={handleInputChange}
                />
                <label htmlFor='password'>Password</label>
                <input
                    type='password'
                    name='wordpass'
                    id='wordpass'
                    minLength={8}
                    required
                    value={formValues.wordpass}
                    onChange={handleInputChange}
                />
                <button className='signupBtn' >SIGN UP</button>
                <p>
                    Already have an account?{" "}
                    <button className='link' onClick={gotoLoginPage}>
                        Login
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Signup;