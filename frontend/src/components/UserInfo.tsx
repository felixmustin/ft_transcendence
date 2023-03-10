import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormValues {
    email: string;
    firstname: string;
    lastname: string;
    age: number;
  }

function UserInfo({getToken}) {
    const [formValues, setFormValues] = useState<FormValues>({
        email: '',
        firstname: '',
        lastname: '',
        age: '',
      });
    const navigate = useNavigate();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormValues(prevState => ({ ...prevState, [name]: value }));
      };

      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let userObj = getToken();
        const url = 'http://localhost:3001/user/' + userObj + '/profile'
        const response = await fetch(url, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
        }).then(response => {
            if (response.ok) {
              navigate("/home");
            } else {
              alert('Creation failed');
            }
          }).catch(error => {
              alert('Creation failed');
            });
      };

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
                <label htmlFor='age'>Age</label>
                <input
                    type='number'
                    name='age'
                    id='age'
                    value={formValues.age}
                    required
                    onChange={handleInputChange}
                />
                <button className='signupBtn' >SIGN UP</button>
            </form>
        </div>
    );
};

export default UserInfo;