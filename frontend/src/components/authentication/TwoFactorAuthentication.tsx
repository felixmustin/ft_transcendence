import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { setSessionToken } from '../../sessionsUtils';
import { LoginForm, tokenForm } from '../../interfaceUtils';
import { Code2FA } from '../../interfaceUtils';
import Cookies from 'js-cookie';

  type Props = {
  item: string;
  setToken: (token: tokenForm) => void
}
  
const TwoFactorAuthentication = (props: Props) => {
  
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState<Code2FA>({code:''});
    const [imageUrl, setImageUrl] = useState('');
  
    const tok = Cookies.get("token");
    if (tok)
      Cookies.remove("token");
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setFormValues(prevState => ({ ...prevState, [name]: value }));
    };
  
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      fetch('http://localhost:3001/2fa/authenticate', {
      method: 'POST',
      headers: {
      'Authorization': 'Bearer ' + props.item,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formValues)
    }).then(res => res.json()
    ).then(response => {
      if (response.statusCode >= 400) {
        alert(response.message);
        }
      else {
        setSessionToken(response.token)
        props.setToken(response.token);
        navigate('/play');
      } 
      });
    };
  
    const generateQRCode = async () => {
      try {
        const response = await fetch('http://localhost:3001/2fa/generate-login', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + props.item,
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const imageUrl = URL.createObjectURL(await response.blob());
        setImageUrl(imageUrl);
      } catch (error) {
        console.error(error);
      }
    };
  

    return (
      <div>
        <div className='text-center mx-auto'>
        <button className='w-full my-3 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' onClick={generateQRCode}>Generate QR Code</button>
        {imageUrl && <img src={imageUrl} alt="QR Code" />}
      </div>
    
      <div className='text-center mx-auto'>
        <form onSubmit={handleSubmit}>
        <div className='flex flex-col py-2'>
          <label>Enter code</label>
          <input className='bg-violet-900 text-white rounded-lg hover:bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 p-2 m-2' type='text' name='code' value={formValues.code} onChange={handleInputChange}/>
        </div>
        <button className='w-full my-3 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' type='submit'>Submit</button>
        </form>
      </div>
      </div>
      )

  }

export default TwoFactorAuthentication