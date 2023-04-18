import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket.js';
import '../assests/CreateGameForm.css';

const CreateGameForm = () => {
  const [name, setName] = useState('');
  const [gameID, setGameID] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('createRoomResponse', (response) => {
      console.log('Client received createRoomResponse');
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: name });
      } else {
        console.error(response.error);
      }
    });

    socket.on('joinRoomResponse', (response) => {
      console.log('Client received joinRoomResponse');
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: name });
      } else {
        setShowErrorMessage(true);
        setTimeout(() => { setShowErrorMessage(false); }, 2500);
        console.error(response.error);
      }
    }, [name]);

    return () => {
      socket.off('createRoomResponse');
      socket.off('joinRoomResponse');
    };
  }, [name]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name.trim() === '') {
      setErrorMessage('Please enter a valid name.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }
    socket.emit('createGameRoom', (response) => {
      console.log('Client received callback function');
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: name });
      } else {
        setErrorMessage('Failed to create a game room.');
        console.error(response.error);
      }
    });
  };

  const handleGameCode = async (event) => {
    event.preventDefault();
    if (name.trim() === '') {
      setErrorMessage('Please enter a valid name.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }
    if (gameID.trim() === '') {
      setErrorMessage('Please enter a valid game code.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }
    socket.emit('joinGameRoom', ({ gameID: gameID }), (response) => {
      console.log('Client received callback function');
      if (response.success) {
        navigate(`/waiting/${gameID}`, { state: name });
      } else {
        setErrorMessage('Game code does not exist.');
        setShowErrorMessage(true);
        setTimeout(() => { setShowErrorMessage(false); }, 2500);
        console.error(response.error);
      }
    });
  };

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
      {showErrorMessage && (<div className="notification-alert notification-alert--error">{errorMessage}</div>)}
  </div>
  );
}

export default CreateGameForm;