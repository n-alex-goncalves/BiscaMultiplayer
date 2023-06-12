import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

import { Layout, CardGroup } from './Layout.js';
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

    const [height, setHeight] = useState(0);
    const componentRef = useRef(null);
  
    const [playerState, setPlayerState] = useState(null);
    const [playerName, setPlayerName] = useState('');
    const [playerPoints, setPlayerPoints] = useState(0);
    const [playerCards, setPlayerCards] = useState([]);

    const [opponentState, setOpponentState] = useState(null);
    const [opponentName, setOpponentName] = useState('');
    const [opponentPoints, setOpponentPoints] = useState(0);
    const [opponentCards, setOpponentCards] = useState([]);

    const [trumpCard, setTrumpCard] = useState(null);
    const [remainingCards, setRemainingCards] = useState(null);
    const [currentTrick, setCurrentTrick] = useState([null, null]); 

    const [turnStatus, setTurnStatus] = useState(null);
    const [isGameEnd, setIsGameEnd] = useState(false);

    useEffect(() => {
        socket.emit('getGameState', { gameID: roomID });

        socket.on('getGameStateResponse', (response) => {
            if (response.success) {
                const { gameState } = response;
                const playerState = gameState.players[socket.id];
                const playerName = playerState.name;
                const playerCards = playerState.hand;
                const playerScore = playerState.score;
                setPlayerName(playerName);
                setPlayerCards(playerCards);
                setPlayerPoints(playerScore);

                const opponentID = Object.keys(gameState.players).find(id => id !== socket.id);
                const opponentState = gameState.players[opponentID];
                const opponentName = opponentState.name;
                const opponentCards = opponentState.hand;
                const opponentScore = gameState.players[opponentID].score;
                setOpponentName(opponentName);
                setOpponentCards(opponentCards);
                setOpponentPoints(opponentScore);

                const remainingCards = gameState.board.remainingCards; 
                const trumpCard = gameState.board.trumpCard;
                const currentTrick = gameState.board.currentTrick;
                const turnStatus = gameState?.turnOrder[gameState?.currentTurnIndex] === socket.id ? 'YourTurn' : 'OpponentTurn';
                setTrumpCard(trumpCard);
                setRemainingCards(remainingCards);
                setCurrentTrick(currentTrick);
                setTurnStatus(turnStatus);
                
                const newHeight = componentRef.current.scrollHeight;
                setHeight(newHeight);
            }

            socket.on('getWinningStateResponse', (response) => { 
                if (response.success) {
                    const { gameState } = response;
                    const playerState = gameState.players[socket.id];
                    setPlayerState(playerState)

                    const opponentID = Object.keys(gameState.players).find(id => id !== socket.id);
                    const opponentState = gameState.players[opponentID];
                    setOpponentState(opponentState)
                    setIsGameEnd(true);
                    
                    socket.emit('gameEnd', {});
                }
            });
        });
        
        return () => {
          socket.off('getGameStateResponse');
          socket.off('getWinningStateResponse');
        };
    }, [roomID]);

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
                    <PlayerComponent name={opponentName} points={opponentPoints} cards={opponentCards} isPlayer={false}></PlayerComponent>
                    <Row>
                        <Col xs={12} sm={12}>
                                <Row className='g-3 h-100'>
                                    <Col className='h-100' id={`deck-column`} xs={7} sm={6}>
                                        <Deck remainingCards={remainingCards} trumpCard={trumpCard}></Deck>
                                    </Col>
                                    <Col className='h-100' id={`trick-column`} xs={7} sm={6}>
                                        <CardGroup className="p-4 h-100" ref={componentRef} style={{ height: `${height}px` }}>
                                            <Row>
                                                {currentTrick.map((data, index) => (
                                                    <Col key={`card-column-${index}`}>
                                                        <Card 
                                                            Card={data}
                                                            uniqueID={`current-trick-card-${index+1}`}
                                                            origin={data?.cardOwnership === socket?.id ? `player-card-${data?.index+1}` : `opponent-card-${data?.index+1}`}
                                                        ></Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </CardGroup>
                                    </Col>
                                </Row>
                        </Col>
                    </Row>
                    <Row className='align-items-center pt-4 mt-4'>
                        <Col>
                            <TurnStatus turnStatus={turnStatus}></TurnStatus>
                        </Col>
                    </Row>
                    <PlayerComponent name={playerName} points={playerPoints} cards={playerCards} isPlayer={true}></PlayerComponent>
            </motion.div>
            </Layout>
        </Container>
        );
}

export default CardGameBoard;