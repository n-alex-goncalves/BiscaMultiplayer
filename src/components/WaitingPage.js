import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import socket from '../socket.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import '../assests/WaitingPage.scss';

function WaitingPage() {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const location = useLocation();
  const timeoutRef = useRef(null);
  const name = location.state;

  useEffect(() => {
    // Listen for the startGame event from the server
    socket.emit('onPlayerReady', { name: name });
    socket.on('startGameSession', () => {
      console.log('Client received startGameResponse');
      navigate(`/game/${roomID}`);
    });
    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('startGameSession');
    };
  }, []);

  const handleCopy = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    setShowCopyMessage(true);
    setTimeout(() => { setShowCopyMessage(false); }, 2500);
  };

  return (
    <div className="waiting-page-container">
      <h2>WAITING FOR OTHER PLAYER...</h2>
      <div className="flickity-container">
        <div className="hand">
          <div className="card card-1"><span></span></div>
          <div className="card card-2"><span></span></div>
          <div className="card card-3"><span></span></div>
        </div>
      </div>
        <div className="copy-text">
          <div className="text">Game Code: {roomID}</div>
          <CopyToClipboard text={`${roomID}`} onCopy={handleCopy}>
            <button><i className="fa fa-clone"></i></button>
          </CopyToClipboard>
        </div>
      <p>Share the above code with your friends so they can join your game!</p>
      {showCopyMessage && (<div className="notification-alert notification-alert--success"> Game Code copied!</div>)}
    </div>
  );
}

export default WaitingPage;