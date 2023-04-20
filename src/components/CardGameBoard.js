import React, { useState, useEffect, createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Score, CardGroup, Row, Column } from './Layout';
import { useNavigate } from 'react-router-dom';

import TurnStatus from './TurnStatus'; 
import Card from "./Card.js";
import Deck from "./Deck.js";
import socket from '../socket.js';
import '../assests/CardGameBoard.css';

const CardGameBoard = () => {

    const { roomID } = useParams();
    const navigate = useNavigate();

    // Player's state
    const [playerName, setPlayerName] = useState('');
    const [playerPoints, setPlayerPoints] = useState(0);
    const [playerCards, setPlayerCards] = useState([]);

    // Opponent's state
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
    const [winningPlayerName, setWinningPlayerName] = useState('');
    
    useEffect(() => {
        // Listen for the startGame event from the server
        socket.emit('getGameState', { gameID: roomID });
        
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
                setIsGameEnd(true);
            });
        });
        
        // Clean up the event listener when the component unmounts
        return () => {
          socket.off('getGameStateResponse');
          socket.off('getWinningStateResponse');
        };
    }, []);

    // Function for dealing with card selection
    const handleCardSelection = (card, index) => {
        const data = {
            card: card,
            index: index,
            gameID: roomID,
        }
        socket.emit('onCardSelected', data);
    }

    // Function to reset game state
    const resetGame = () => {
        // ask server to reset game
    };

    // Function for game-ending screen
    const renderGameEndScreen = () => {
        return (
            <div className="game-end-screen">
                <h1>{winningPlayerName} won!</h1>
                <button onClick={resetGame}>Rematch</button>
                <button onClick={() => navigate(`/`)}>Back to Home Page</button>
            </div>
        );
    };

    return (
        <Layout>
            {isGameEnd ? renderGameEndScreen() : null}
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
                                    Card={data}
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
                                        origin={data?.cardOwnership == socket?.id ? `player-card-${data?.index+1}` : `opponent-card-${data?.index+1}`}
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
                        <div>Points: {playerPoints}</div>
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
        </Layout>
        );
}

export default CardGameBoard

// TO DO:

// end-game sequence
/*

    [NAME] won!


[REMATCH] [BACK TO HOME PAGE]

*/