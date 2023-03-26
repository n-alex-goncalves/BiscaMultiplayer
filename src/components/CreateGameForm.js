import React, { useState } from 'react';
import axios from 'axios';

function CreateGameForm() {
  const [name, setName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/createGame', { player: name });
      const { roomId } = response.data;
      // Redirect the user to the waiting page with the game code
      window.location.href = `/game/${roomId}`;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" value={name} onChange={(event) => setName(event.target.value)} />
      <button type="submit">Create Game</button>
    </form>
  );
}

export default CreateGameForm;