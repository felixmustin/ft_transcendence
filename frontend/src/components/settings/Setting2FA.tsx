import React, { useEffect, useState } from 'react'
import { getAccessSessionsPayload, getSessionsToken } from '../../sessionsUtils';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { Code2FA } from '../../interfaceUtils';


type Props = {
  item: {
    accessToken: string | undefined;
  };
}


const Setting2FA = (props: Props) => {

  const [Code2FA, setCode2FA] = useState<Code2FA>({code:''});
  const [imageUrl, setImageUrl] = useState('');
  const [activateButton, setActivateButton] = useState('');
  const [isActivated, setisActivated] = useState(false);

  const navigate = useNavigate();
 
  useEffect(() => {
    const payload = getAccessSessionsPayload();
     if (payload) {
        if (payload.twoFaEnabled == true) {
          setActivateButton("Desactivate 2FA");
          setisActivated(true)
        }
        else {
          setActivateButton("Activate 2FA");
          setisActivated(false)
        }
      }
      else
       navigate('/')
  });


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setCode2FA(prevState => ({ ...prevState, [name]: value }));
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const auth = 'Bearer ' + props.item.accessToken;

    if (!isActivated) {
      fetch('http://localhost:3001/2fa/turn-on', {
      method: 'POST',
      headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(Code2FA)
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
      body: JSON.stringify(Code2FA)
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
      const auth = 'Bearer ' + props.item.accessToken
      const response = await fetch('http://localhost:3001/2fa/generate', {
        method: 'GET',
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
       <input className='bg-violet-900 text-white rounded-lg hover:bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 p-2 m-2' type='text' name='code' value={Code2FA.code} onChange={handleInputChange}/>
     </div>
     <button className='w-full my-3 py-2 bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 text-white font-semibold rounded-lg' type='submit'>Submit</button>
     </form>
   </div>
  </div>
  )
}

export default Setting2FA