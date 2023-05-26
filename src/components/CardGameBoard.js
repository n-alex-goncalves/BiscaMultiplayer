import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

import { Layout } from './Layout.js';
import { Container, Row, Col } from 'react-bootstrap'
import '../assets/CardGameBoard.css';

import Card from './subcomponent/Card';
import Deck from './subcomponent/Deck';
import PlayerComponent from './subcomponent/PlayerComponent';
import TurnStatus from './subcomponent/TurnStatus';
import GameOver from './subcomponent/GameOver';

import socket from '../socket.js';

const CardGameBoard = () => {

    const { roomID } = useParams();

    // Player's state
    const [playerState, setPlayerState] = useState(null);
    const [playerName, setPlayerName] = useState('Nuno');
    const [playerPoints, setPlayerPoints] = useState(0);
    const [playerCards, setPlayerCards] = useState([1, 1, 1]);

    // Opponent's state
    const [opponentState, setOpponentState] = useState(null);
    const [opponentName, setOpponentName] = useState('Nuno');
    const [opponentPoints, setOpponentPoints] = useState(0);
    const [opponentCards, setOpponentCards] = useState([1, 1, 1]);

    // Board's state
    const [remainingCards, setRemainingCards] = useState(5);
    const [trumpCard, setTrumpCard] = useState(null);
    const [currentTrick, setCurrentTrick] = useState([1]); 

    // Turn status
    const [turnStatus, setTurnStatus] = useState(null);

    // Game ending state
    const [isGameEnd, setIsGameEnd] = useState(false);
    
    useEffect(() => {
        // Listen for the startGame event from the server
        socket.emit('getGameState', { gameID: roomID });
        
        // should wait like a second when i receive a state.
        socket.on('getGameStateResponse', (response) => {
            if (response.success) {
                const { gameState } = response;
                
                // Set player's name
                const playerState = gameState.players[socket.id];
                const playerName = playerState.name;
                setPlayerName(playerName);

                // Set player's hand
                const playerCards = playerState.hand;
                setPlayerCards(playerCards);

                // Set player's points
                const playerScore = playerState.score;
                setPlayerPoints(playerScore);

                // Set opponent's name
                const opponentID = Object.keys(gameState.players).find(id => id !== socket.id);
                const opponentState = gameState.players[opponentID];
                const opponentName = opponentState.name;
                setOpponentName(opponentName);

                // Set opponent's hand
                const opponentCards = opponentState.hand;
                setOpponentCards(opponentCards);

                // Set opponent's points
                const opponentScore = gameState.players[opponentID].score;
                setOpponentPoints(opponentScore);

                // Set deck (based on remainingCards)
                const remainingCards = gameState.board.remainingCards; 
                setRemainingCards(remainingCards);

                // Set trump card
                const trumpCard = gameState.board.trumpCard;
                setTrumpCard(trumpCard);
                
                // Set current trick cards
                const currentTrick = gameState.board.currentTrick
                setCurrentTrick(currentTrick);
                
                // Set turn status
                const turnStatus = gameState?.turnOrder[gameState?.currentTurnIndex] === socket.id ? 'YourTurn' : 'OpponentTurn';
                setTurnStatus(turnStatus);
            }

            socket.on('getWinningStateResponse', (response) => { 
                if (response.success) {
                    const { gameState } = response;

                    // Emit to server
                    socket.emit('gameEnd', {});

                    // Set player's state
                    const playerState = gameState.players[socket.id];
                    setPlayerState(playerState)

                    // Set opponent's state
                    const opponentID = Object.keys(gameState.players).find(id => id !== socket.id);
                    const opponentState = gameState.players[opponentID];
                    setOpponentState(opponentState)
                    
                    setIsGameEnd(true);
                }
            });
        });
        
        // Clean up the event listener when the component unmounts
        return () => {
          socket.off('getGameStateResponse');
          socket.off('getWinningStateResponse');
        };
    }, [roomID]);

    // Function for game-ending screen
    const renderGameEndScreen = () => {
        return (
            <GameOver playerState={playerState} opponentState={opponentState} winnerName={ playerState.score > opponentState.score ? playerState.name : opponentState.name }></GameOver>
        );
    };

    return (
        <Container fluid className='game-container'>
            <Layout className='game-content'>
                {isGameEnd ? renderGameEndScreen() : null}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <PlayerComponent name={opponentName} points={opponentPoints} cards={opponentCards}></PlayerComponent>
                    <Row className="mt-4 mb-4">
                        <Col xs={12} sm={12}>
                                <Row className='g-0'>
                                    <Col xs={6} sm={6}>
                                        <Deck remainingCards={remainingCards}></Deck>
                                    </Col>
                                    {currentTrick.map((data, index) => (
                                        <Col id={`trick-column-${index}`} xs={6} sm={6}>
                                            <div style={{ display: 'flex', width: '100%' }} className=''>
                                                <Card 
                                                    Card={{ image:'https://deckofcardsapi.com/static/img/back.png' }}
                                                    uniqueID={`current-trick-card-${index+1}`}
                                                    origin={data?.cardOwnership === socket?.id ? `player-card-${data?.index+1}` : `opponent-card-${data?.index+1}`}
                                                    exit={{ scale: 0, opacity: 0, rotate: 180 }}
                                                >
                                                </Card>
                                            <div style={{ marginLeft: '5%'}}>
                                               <Card 
                                                    Card={{ image:'https://deckofcardsapi.com/static/img/back.png' }}
                                                    uniqueID={`current-trick-card-${index+1}`}
                                                    origin={data?.cardOwnership === socket?.id ? `player-card-${data?.index+1}` : `opponent-card-${data?.index+1}`}
                                                    exit={{ scale: 0, opacity: 0, rotate: 180 }}
                                                ></Card>
                                            </div>
                                            </div>

                                        </Col>
                                    ))}
                                </Row>
                        </Col>
                    </Row>
                    <TurnStatus turnStatus={turnStatus}></TurnStatus>
                    <PlayerComponent name={playerName} points={playerPoints} cards={playerCards}></PlayerComponent>


            </motion.div>
            </Layout>
        </Container>
        );
}

export default CardGameBoard;