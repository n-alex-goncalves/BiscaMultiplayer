import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

import { Layout, Score, CardGroup, Row, Column } from './Layout.js';
import '../assets/CardGameBoard.css';

import Card from './subcomponent/Card';
import Deck from './subcomponent/Deck';
import NoCardsRemainingMessage from './subcomponent/NoCardsRemaining';
import TurnStatus from './subcomponent/TurnStatus';
import GameOver from './subcomponent/GameOver';

import socket from '../socket.js';

const CardGameBoard = () => {

    const { roomID } = useParams();

    // Player's state
    const [playerState, setPlayerState] = useState(null);
    const [playerName, setPlayerName] = useState('');
    const [playerPoints, setPlayerPoints] = useState(0);
    const [playerCards, setPlayerCards] = useState([]);

    // Opponent's state
    const [opponentState, setOpponentState] = useState(null);
    const [opponentName, setOpponentName] = useState('');
    const [opponentPoints, setOpponentPoints] = useState(0);
    const [opponentCards, setOpponentCards] = useState([]);

    // Board's state
    const [remainingCards, setRemainingCards] = useState(null);
    const [trumpCard, setTrumpCard] = useState(null);
    const [currentTrick, setCurrentTrick] = useState([]); 

    // Turn status
    const [turnStatus, setTurnStatus] = useState(null);

    // Game ending state
    const [isGameEnd, setIsGameEnd] = useState(false);

    useEffect(() => {
        // Code to run after myState is updated
        updateScore();
      }, [playerPoints]); // Specify the dependency as myState
    
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

    // Function for dealing with card selection
    const handleCardSelection = (card, index) => {
        const data = {
            card: card,
            index: index,
            gameID: roomID,
        }
        socket.emit('onCardSelected', data);
    }

    // Function to update the score and trigger animation
    const updateScore = () => {
        // Add the CSS class for the animation
        const scoreDiv = document.getElementById('scoreDiv');
        
        // Add the CSS class for the animation
        scoreDiv.className += 'score-animation';

        // Remove the CSS class after a short delay
        setTimeout(() => {
            scoreDiv.className = scoreDiv.className.replace('score-animation', '');
        }, 1500); // Change this value to adjust the duration of the animation
    }

    // Function for game-ending screen
    const renderGameEndScreen = () => {
        return (
            <GameOver playerState={playerState} opponentState={opponentState} winnerName={ playerState.score > opponentState.score ? playerState.name : opponentState.name }></GameOver>
        );
    };

    return (
        <Layout style={{backgroundColor: 'forestgreen'}}>
            {isGameEnd ? renderGameEndScreen() : null}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5 }}
            >
            <Column>
                <Row>
                    <Score>
                        <div>{opponentName}</div>
                        <div>Points: {opponentPoints}</div>
                    </Score>
                    <CardGroup>
                        <Row>
                            {opponentCards.map((data, index) => (
                            <Column key={`card-column-${index}`}>
                                <Card
                                    Card={data && { image: 'https://deckofcardsapi.com/static/img/back.png' }}
                                    uniqueID={`opponent-card-${index+1}`}
                                ></Card>
                            </Column>
                            ))}
                        </Row>
                    </CardGroup>
                </Row>
                <Row>
                    <CardGroup>
                        <Row>
                            <Column>
                                <Deck 
                                    remainingCards={remainingCards}
                                ></Deck>
                                {remainingCards === 0 && <NoCardsRemainingMessage duration={1500}/>}
                            </Column>
                            <Column>
                                <Card 
                                    Card={trumpCard} 
                                    uniqueID={`trump-card`}
                                    origin={`deck`}
                                ></Card>    
                            </Column>
                        </Row>
                    </CardGroup>
                    <CardGroup>
                        <Row>
                            {currentTrick.map((data, index) => (
                                <Column id={`trick-column-${index}`}>
                                    <Card 
                                        Card={data}
                                        uniqueID={`current-trick-card-${index+1}`}
                                        origin={data?.cardOwnership === socket?.id ? `player-card-${data?.index+1}` : `opponent-card-${data?.index+1}`}
                                        exit={{ scale: 0, opacity: 0, rotate: 180 }}
                                    ></Card>
                                </Column>
                            ))}
                        </Row>
                    </CardGroup>
                </Row>
                <TurnStatus turnStatus={turnStatus}></TurnStatus>
                <Row>
                    <Score>
                        <div>{playerName}</div>
                        <div id="scoreDiv">Points: {playerPoints}</div>
                    </Score>
                    <CardGroup>
                        <Row>
                            {playerCards.map((data, index) => (
                                <Column key={`card-column-${index}`}>
                                    <div className="hover-effect" >
                                        <Card 
                                            Card={data} 
                                            uniqueID={`player-card-${index+1}`} 
                                            onClick={() => handleCardSelection(data, index)} 
                                        ></Card>
                                    </div>
                                </Column>
                            ))}
                        </Row>
                    </CardGroup>
                </Row>
            </Column>
           </motion.div>
        </Layout>
        );
}

export default CardGameBoard;