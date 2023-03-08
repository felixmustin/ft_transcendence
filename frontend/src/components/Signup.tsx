import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormValues {
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    wordpass: string;
  }

function Signup() {
    const [formValues, setFormValues] = useState<FormValues>({
        email: '',
        username: '',
        firstname: '',
        lastname: '',
        wordpass: '',
      });
    const navigate = useNavigate();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormValues(prevState => ({ ...prevState, [name]: value }));
      };

      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/auth/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formValues),
            });
      
            const data = await response.json();
      
            console.log('Response:', data);
          } catch (error) {
            console.error('Error:', error);
          }
    };

    
    const gotoLoginPage = () => navigate("/login");

    return (
        <div className='signup__container'>
            <h2>Sign up </h2>
            <form className='signup__form' onSubmit={handleSubmit}>
                <label htmlFor='email'>Email Address</label>
                <input
                    type='text'
                    name='email'
                    id='email'
                    value={formValues.email}
                    required
                    onChange={handleInputChange}
                />
                <label htmlFor='username'>Username</label>
                <input
                    type='text'
                    id='username'
                    name='username'
                    value={formValues.username}
                    required
                    onChange={handleInputChange}
                />
                <label htmlFor='firstname'>Firstname</label>
                <input
                    type='text'
                    name='firstname'
                    id='firstname'
                    value={formValues.firstname}
                    required
                    onChange={handleInputChange}
                />
                <label htmlFor='lastname'>Lastname</label>
                <input
                    type='text'
                    name='lastname'
                    id='lastname'
                    value={formValues.lastname}
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
                    <span className='link' onClick={gotoLoginPage}>
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Signup;