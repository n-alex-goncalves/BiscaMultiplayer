import './assets/App.css';
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import AudioPlayer from './components/subcomponent/AudioPlayer'
import CreateGameForm from './components/CreateGameForm';
import WaitingPage from './components/WaitingPage';
import CardGameBoard from './components/CardGameBoard'

function App() {
  return (
    <div className="App">
      <AudioPlayer src="http://localhost:8000/background-music.mp3" />
      <HashRouter basename='/'>
        <Routes>
          <Route path="/" element={< CreateGameForm />} />
          <Route path="/waiting/:roomID" element={< WaitingPage />} />
          <Route path="/game/:roomID" element={< CardGameBoard />} />
        </Routes>
      </HashRouter>
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
