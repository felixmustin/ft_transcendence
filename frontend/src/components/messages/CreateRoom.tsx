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

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setRoomMode(value);
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
      console.log(result);
      setCreateRoom(false);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Room name:</label>
        <input type="text" id="name" name="name" onChange={handleNameChange}/>
        <label htmlFor="mode">Room mode:</label>
        <input type="text" id="mode" name="mode" onChange={handleModeChange}/>
        { (roomMode === 'private' || roomMode === 'protected') &&
        <div>
          <label htmlFor="password">Room password:</label>
          <input type="text" id="password" name="password" onChange={handlePassChange}/>
        </div>
        }
        <button type='submit'>Create</button>
        <button onClick={() => setCreateRoom(false)}>Cancel</button>
      </form>
    </div>
  )
}

export default CreateRoom