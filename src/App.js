import './assets/App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AudioPlayer from './components/subcomponent/AudioPlayer';
import CreateGameForm from './components/CreateGameForm';
import CardGameBoard from './components/CardGameBoard';
import WaitingPage from './components/WaitingPage';

function App() {
  return (
    <div className="App">
      <AudioPlayer src="http://localhost:8000/background-music.mp3" />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={< CardGameBoard />} />
          <Route path="/waiting/:roomID" element={< WaitingPage />} />
          <Route path="/game/:roomID" element={< CardGameBoard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
