import React, { useState } from 'react';

function FormJoinRoom(props : any) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event : any) => {
    event.preventDefault();
    props.onSubmit(inputValue);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter some text:
        <input
          type="text"
          onChange={(e) => setInputValue(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default FormJoinRoom;
