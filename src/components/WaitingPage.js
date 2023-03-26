import React from 'react';
import { useParams } from 'react-router-dom';

function WaitingPage() {
  const { roomId } = useParams();

  return (
    <div>
      <h2>Waiting for Players</h2>
      <p>Your game code is: {roomId}</p>
      <p>Share this code with your friends so they can join your game!</p>
    </div>
  );
}

export default WaitingPage;