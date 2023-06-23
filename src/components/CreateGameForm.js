import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Container, Form, Button } from 'react-bootstrap'

import AccordionMenu from './subcomponent/AccordionMenu';
import socket from '../socket.js';

import '../assets/CreateGameForm.css';

const CreateGameForm = () => {
  
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [gameID, setGameID] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle receiving the response for create room and join room
  useEffect(() => {
    socket.on('createRoomResponse', (response) => {
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: name });
      } else {
        console.error(response.error);
      }
    });

    socket.on('joinRoomResponse', (response) => {
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: name });
      } else {
        setErrorMessage('Game room does not exist.');
        setShowErrorMessage(true);
        setTimeout(() => { setShowErrorMessage(false); }, 2500);
        console.error(response.error);
      }
    });

    return () => {
      socket.off('createRoomResponse');
      socket.off('joinRoomResponse');
    };
  });

  const GameTitle = () => {
    return (
      <motion.div
        className="create-game-form-title"
        initial={{ scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 17 }}
      >
        BISCA!
      </motion.div>
    )
  }

  // Handle the response for creating a room
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name.trim() === '') {
      setErrorMessage('Please enter a valid name.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }

    socket.emit('createGameRoom', (response) => {
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: name });
      } else {
        setErrorMessage('Failed to create a game room.');
        console.error(response.error);
      }
    });
  };


  // Handle the response for joining a room
  const handleGameCode = async (event) => {
    event.preventDefault();
    if (name.trim() === '' && gameID.trim() === '') {
      setErrorMessage('Please enter a valid name/game code.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }

    socket.emit('joinGameRoom', ({ gameID: gameID }), (response) => {
      if (response.success) {
        navigate(`/waiting/${gameID}`, { state: name });
      } else {
        setErrorMessage('Game code does not exist.');
        setShowErrorMessage(true);
        setTimeout(() => { setShowErrorMessage(false); }, 2500);
        console.error(response.error);
      }
    })
  };

  return (
    <Container className="create-game-form-container vh-100 d-flex align-items-center justify-content-center">
      {GameTitle()}
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      > 
        <Form onSubmit={handleSubmit} style={{ maxWidth: '200px' }}>
          <Form.Group className="mb-2 text-left">
            <Form.Label className="create-game-form-label float-start">
              Player Name:
            </Form.Label>
            <Form.Control type="text" value={name} onChange={(event) => setName(event.target.value)} className="create-game-form-input" id="name" placeholder="e.g., John" />
          </Form.Group>
          <Button className="mb-3 mb-sm-6 create-game-form-button" type="submit">
            CREATE GAME
          </Button>
        </Form>
        <Form onSubmit={handleGameCode} style={{ maxWidth: '200px' }}>
          <Form.Group className="mb-2 mb-sm-5 text-left">
            <Form.Label className="create-game-form-label float-start">
              Game Code:
            </Form.Label>
            <Form.Control type="text" value={gameID} onChange={(event) => setGameID(event.target.value)} className="create-game-form-input" id="gameID" placeholder="e.g., zdh3fj" />
          </Form.Group>
          <Button className="mb-3 btn join-game-form-button" type="submit">
            JOIN VIA CODE
          </Button>
        </Form>
        <AccordionMenu></AccordionMenu>
        {showErrorMessage && (<div className="notification-alert notification-alert--error">{errorMessage}</div>)}
      </motion.div>
    </Container>
  );
}

export default CreateGameForm;

// 