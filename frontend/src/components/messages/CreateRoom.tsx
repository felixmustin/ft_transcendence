import React from 'react'

type Props = {
  token: string | undefined,
  id: number,
  setCreateRoom: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateRoom = ({ token, id, setCreateRoom }: Props) => {

  const [roomName, setRoomName] = React.useState<string>('');
  const [roomMode, setRoomMode] = React.useState<string>('');
  const [roomPassword, setRoomPassword] = React.useState<string>('');

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
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };


  return (
    <div className="bg-gradient-to-tl from-violet-900 via-black to-black p-6 rounded-lg shadow-lg m-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="name" className="block text-sm text-white font-medium">Room name:</label>
        <input type="text" id="name" name="name" onChange={handleNameChange}/>
          
        <label htmlFor="mode" className="block text-sm text-white font-medium">Room mode:</label>
        <select id="mode" name="mode" onChange={handleModeChange}>
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="protected">Protected</option>
        </select>
        
        { (roomMode === 'protected') &&
      <div>
        <label htmlFor="password">Room password:</label>
        <input type="text" id="password" name="password" onChange={handlePassChange}/>
      </div>
        }
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-500"
          >
            Create
          </button>
          <button
            onClick={() => setCreateRoom(false)}
            className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateRoom