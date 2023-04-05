import React, { useEffect, useState } from 'react'
import { getSessionsToken } from '../../sessionsUtils';


interface FormValues {
  code: string;
}

const Setting2FA = () => {

  const [formValues, setFormValues] = useState<FormValues>({code:''});
  const [imageUrl, setImageUrl] = useState('');
  const [activateButton, setActivateButton] = useState('');
  const [isActivated, setisActivated] = useState(false);


  const token = getSessionsToken()
  const auth = 'Bearer ' + token.access_token;

  useEffect(() => {
    // const fetchData = async () => {
      // const url = 'http://localhost:3001/user/id';

      // try {
      //   const res = await fetch(url, { method: 'GET', headers: { 'Authorization': auth } });
      //   const result = await res.json();

        // console.log(result)
        if (token.twoFaEnabled == true) {
          setActivateButton("Desactivate 2FA");
          setisActivated(true)
        }
        else {
          setActivateButton("Activate 2FA");
          setisActivated(false)
        }
      // } catch (error) {
      //   console.log(error) 
      // }
    // };
    // fetchData()
  });


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues(prevState => ({ ...prevState, [name]: value }));
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isActivated) {
      fetch('http://localhost:3001/2fa/turn-on', {
      method: 'POST',
      headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues)
      }).then(response => {
        if (response.ok) {
          alert("2FA Activated");
          setImageUrl('');
        } else {
          alert("Activation failed");
        }
      });
    }
    else
    {
      fetch('http://localhost:3001/2fa/turn-off', {
      method: 'POST',
      headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues)
      }).then(response => {
        if (response.ok) {
          alert("2FA Desactivated");
          setImageUrl('');
        } else {
          alert("Desactivation failed");
        }
      });
    }
  }

  const generateQRCode = async () => {
    try {
      const response = await fetch('http://localhost:3001/2fa/generate', {
        method: 'POST',
        headers: {
          Authorization: auth,
        },
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
    <button className='w-full my-3 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' onClick={generateQRCode}>{activateButton}</button>
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

export default Setting2FA