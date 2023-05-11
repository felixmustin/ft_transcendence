import React from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
  token: string | undefined,
  id: number,
  setCreateRoom: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateRoom = ({ token, id, setCreateRoom }: Props) => {

  const [roomName, setRoomName] = React.useState<string>('');
  const [roomMode, setRoomMode] = React.useState<string>('');
  const [roomPassword, setRoomPassword] = React.useState<string>('');

  const navigate = useNavigate();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setRoomName(value);
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMode = event.target.value;
    setRoomMode(selectedMode);
  };

  const handlePassChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setRoomPassword(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const auth = 'Bearer ' + token;
    const url = 'http://localhost:3001/chatroom/create';
    const body = {
      name: roomName,
      mode: roomMode || 'public',
      password: roomPassword,
    }
    try {
      const res = await fetch(url, { method: 'POST', headers: { Authorization: auth, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await res.json();
      setCreateRoom(false);
      window.location.reload(); 
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };


  return (
    <div className="bg-gradient-to-tl from-violet-900 via-black to-black p-6 rounded-lg shadow-lg m-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xl text-white font-bold">Room name:</label>
          <input type="text" id="name" name="name" className='bg-white text-black rounded-lg' placeholder=' Enter a room name' onChange={handleNameChange}/>
        </div>
        <div>
          <label htmlFor="mode" className="block text-xl text-white font-bold">Room mode:</label>
          <select id="mode" name="mode" className='bg-black text-white ' onChange={handleModeChange}>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="protected">Protected</option>
          </select>
        </div>
        { roomMode === 'protected' &&
          <div>
            <label htmlFor="password">Room password:</label>
            <input type="text" id="password" name="password" className='bg-white text-black rounded-lg' onChange={handlePassChange}/>
          </div>
        }
        <div className="flex justify-between">
          <button type="submit" className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-500 border border-black">
            Create
          </button>
          <button onClick={() => setCreateRoom(false)} className="px-4 py-2 rounded-md text-white bg-red-700 hover:bg-red-600 border border-black" >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateRoom