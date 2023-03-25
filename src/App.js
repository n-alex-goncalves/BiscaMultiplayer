
import './assests/App.css';
import HomePage from './components/HomePage';
import io from 'socket.io-client';
// import React, { useState, useEffect } from 'react';
// import socket from 'socket.js';
// import CardGameBoard from './components/CardGameBoard'
// import { Layout } from './components/Layout';

const socket = io('http://localhost:8000');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);

function handleInit(msg) {
  console.log(msg);
}

function handleGameState(gameState) {
  console.log(gameState);
}

function App() {
  return (
    <div className="App">
      <header>CARD GAME</header>
      <HomePage></HomePage>
    </div>
  );
}

export default App;

/*
App.Test.js

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/
