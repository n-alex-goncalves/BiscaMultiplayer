
import './assests/App.css';
import CreateGameForm from './components/CreateGameForm';
import io from 'socket.io-client';
// import React, { useState, useEffect } from 'react';
// import socket from 'socket.js';
// import CardGameBoard from './components/CardGameBoard'
// import { Layout } from './components/Layout';

function App() {
  return (
    <div className="App">
      <header>CARD GAME</header>
      <CreateGameForm></CreateGameForm>
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
