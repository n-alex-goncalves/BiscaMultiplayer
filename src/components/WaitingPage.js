import React from 'react';
import { useParams } from 'react-router-dom';
import '../assests/WaitingPage.scss';

function WaitingPage() {
  const { roomId } = useParams();

  return (
    <div className="waiting-page-container">
      <h2>WAITING FOR OTHER PLAYER...</h2>
      <div class="flickity-container">
      <div class="hand">
        <div class="card card-1"><span></span></div>
        <div class="card card-2"><span></span></div>
        <div class="card card-3"><span></span></div>
      </div>
    </div>
      <p>Game Code: {roomId}</p>
      <p>Share the above code with your friends so they can join your game!</p>
    </div>
  );
}

export default WaitingPage;
