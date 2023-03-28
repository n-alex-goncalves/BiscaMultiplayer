import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assests/CreateGameForm.css';

function CreateGameForm() {
  const [name, setName] = useState('');
  // const [nameError, setNameError] = useState(false)
  const [gameID, setGameID] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/createRoom', { player: name });
      const roomID = response.data.gameID;
      // Redirect the user to the waiting page with the game code
      navigate(`/waiting/${roomID}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGameCode = async (event) => {
    const response = await axios.post('http://localhost:8000/joinRoom', { player: name });
    event.preventDefault();
    try {
      navigate(`/waiting/${gameID}`);
    } catch (error) {
      console.error(error);
    }
  };
  
  /*
  const handleHowToPlayClick = () => {
    // Show modal window with how to play instructions
    console.log('Show how to play modal window');
  };

  const handleContactUsClick = () => {
    // Show modal window with contact information
    console.log('Show contact us modal window');
  };

  const handleLanguageChange = (event) => {
    // Change language based on selected option
    console.log(`Selected language: ${event.target.value}`);
  };
  */

  return (
    <div className="create-game-form-container">
      <h1 className="create-game-form-title">BISCA</h1>
      <form onSubmit={handleSubmit}>
        <div className="create-game-form-input-container">
          <label htmlFor="name" className="create-game-form-label">Player Name:</label>
          <input type="text" id="name" placeholder="e.g., John" value={name} onChange={(event) => setName(event.target.value)} className="create-game-form-input" />
        </div>
        <button type="submit" className="create-game-form-button">CREATE GAME</button>
      </form>
      <form onSubmit={handleGameCode}>
        <div className="create-game-form-input-container">
          <label htmlFor="gameID" className="create-game-form-label">Game Code:</label>
          <input type="text" id="gameID" placeholder="e.g., zdh3fj" value={gameID} onChange={(event) => setGameID(event.target.value)} className="create-game-form-input" />
        </div>
        <button type="submit" className="join-game-form-button">JOIN VIA CODE</button>
      </form>
  </div>
  );
}

export default CreateGameForm;