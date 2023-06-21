import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Container } from 'react-bootstrap'

import '../assets/WaitingPage.scss';

import socket from '../socket.js';

const WaitingPage = () => {

  const navigate = useNavigate();

  const { roomID } = useParams();
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const location = useLocation();
  const timeoutRef = useRef(null);
  const name = location.state;

  useEffect(() => {
    socket.emit('onPlayerReady', { name: name });
    socket.on('startGameSession', () => { navigate(`/game/${roomID}`) });

    return () => {
      socket.off('startGameSession');
    };
  });

  const handleCopy = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    setShowCopyMessage(true);
    setTimeout(() => { setShowCopyMessage(false); }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Container className="waiting-page-container vh-100 vw-100 d-flex align-items-center justify-content-center">
          <h2 className="mt-md-3 ms-2 me-2 mb-2">WAITING FOR OTHER PLAYER...</h2>
          <div className="flickity-container mt-2 mt-md-4 mb-2 mb-md-4">
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
          <p className="mt-4 mt-md-3 ms-2 me-2">Share the above code with your friends so they can join your game!</p>
          {showCopyMessage && (<div className="notification-alert notification-alert--success"> Game Code copied!</div>)}
      </Container>
    </motion.div>
  );
}

export default WaitingPage;