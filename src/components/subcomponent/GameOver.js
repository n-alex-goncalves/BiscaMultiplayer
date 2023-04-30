import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Row, Column } from '../Layout';

import socket from '../../socket.js';
import InfoCard from "./InfoCard";
import '../../assets/GameOver.css';

const GameOver = ({playerState, opponentState, winnerName}) => {
    const { roomID } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('joinRoomResponse', (response) => {
          if (response.success) {
            const roomID = response.gameID;
            navigate(`/waiting/${roomID}`, { state: playerState.name });
          }
        });

        return () => {
          socket.off('joinRoomResponse');
        };
      });

  const handleRematch = () => {
    socket.emit('joinGameRoom', ({ gameID: roomID }));
  }

  return (
    <Layout>
        <AnimatePresence>
            <motion.div
                className='background'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                exit={{ opacity: 0, scale: 0, duration: 5 }}
            >
                <Column>
                    <Row>
                        <motion.div
                            style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Column>
                                <Row></Row>
                                <Row>
                                    <motion.p
                                        className='game-title'
                                        initial={{ y: 200 }}
                                        animate={{ y: -20 }}
                                        transition={{ type: 'spring', bounce: 0.5, delay: 2 }}
                                    >
                                        GAME ENDED
                                    </motion.p>
                                </Row>
                                    <motion.p
                                        className='game-title'
                                        initial={{ opacity: 0, y: -50 }}
                                        animate={{ opacity: 1, y: -50 }}
                                        transition={{ type: 'spring', bounce: 0.5, delay: 2 }}
                                    >
                                        {winnerName} WON!
                                    </motion.p>
                                <Row>
                                    <Column>
                                        <InfoCard playerName={playerState.name} points={playerState.score} cardsWon={playerState.cardsWon}></InfoCard>
                                    </Column>
                                    <Column></Column>
                                    <Column></Column>
                                    <Column>
                                        <InfoCard playerName={opponentState.name} points={opponentState.score} cardsWon={opponentState.cardsWon}></InfoCard>
                                    </Column>
                                </Row>
                                <Row>
                                    <motion.button
                                        className='end-game-button'
                                        style={{ marginTop: '290px' }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }} 
                                        transition={{ duration: 1, delay: 2 }}
                                        onClick={() => {handleRematch()}}
                                    >
                                        REMATCH
                                    </motion.button>
                                </Row>
                                <Row>
                                    <motion.button
                                        className='end-game-button'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }} 
                                        transition={{ duration: 1, delay: 2 }}
                                        onClick={() => {navigate(`/`)}}
                                    >
                                        RETURN TO HOMEPAGE
                                    </motion.button>
                                </Row>
                            </Column>
                        </motion.div>
                    </Row>
                </Column>
            </motion.div>
        </AnimatePresence>
    </Layout>
  );
};

/**


.box {
  width: 200px;
  height: 200px;
  background: var(--accent);
}

  .join-game-form-button {
    padding: 10px 20px;
    font-size: 1.2rem;
    background-color:#6662b9;
    color: white;
    border: none;
    border-radius: 5px;
    margin-bottom: 20px;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }

                                        <motion.h2 style={{color: 'white'}}>PLAYER 2</motion.h2>
                                        <motion.div
                                            className='endCard'
                                            style={{ marginTop: "15px",
                                                     backgroundColor: "white",
                                                     borderRadius: '5px',
                                                     padding: '5px 12px'
                                            }}
                                            variants={variants}
                                            whileHover={'open'}
                                            initial={{ opacity: 0 }}
                                            animate={'general'} // -15 
                                        >
                                            <motion.h2>POINTS: 50</motion.h2>
                                            {isOpen && (
                                            <motion.div
                                                initial={{ }}
                                                animate={{ }} // -15 
                                                transition={{ }}
                                            >
                                                <p>hello</p>
                                            </motion.div>
                                            )}
                                        </motion.div>
 */
export default GameOver;
