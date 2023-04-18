import React, { useState, useEffect, createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Score, CardGroup, Row, Column } from './Layout';
import TurnStatus from './TurnStatus'; 
import '../assests/CardGameBoard.css';

import socket from '../socket.js';
import Card from "./Card.js";
import Deck from "./Deck.js";

// TO DO:

// end-game sequence
/*

    [NAME] won!


[REMATCH] [BACK TO HOME PAGE]

*/


// deck should correlate with the number of remaining cards
// animations for drawing
// animations for adding to the trick

/*
const positionMatrix = {};

const originDestPairs = [
    'player-card-1',
    'player-card-2',
    'player-card-3',
    'current-trick-card-1',
    'current-trick-card-2',
    'deck',
    'opponent-card-1',
    'opponent-card-2',
    'opponent-card-3'
];

const calculateInitialPosition = (origin, destination) => {
    const originElement = document.getElementById(origin); 
    const destinationElement = document.getElementById(destination);

    console.log(originElement, destinationElement);
    
    if (originElement && destinationElement) {
      const originRect = originElement.getBoundingClientRect();
      const destinationRect = destinationElement.getBoundingClientRect(); 

      const deckX = originRect.left - destinationRect.left;
      const deckY = originRect.top - destinationRect.top;

      return [deckX, deckY]
    }
    return [0, 0]
};

const calculateMatrix = () => {
    for (let i = 0; i < originDestPairs.length; i++) {
        const origin = originDestPairs[i]
        positionMatrix[origin] = {}; // Initialize nested object for the origin
        for (let j = 0; j < originDestPairs.length; j++) {
            if (i !== j) {
                const destination = originDestPairs[j]
                positionMatrix[origin][destination] = calculateInitialPosition(origin, destination)
            }
        }
    }
}

calculateMatrix();

// Create the context
export const Context = createContext();
*/

const CardGameBoard = () => {
    const { roomID } = useParams();

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

    /*
    useEffect(() => {
        calculateMatrix();
      }, []); // Empty dependency array, so the effect only runs once
    */

    
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
                if (gameState.turnOrder[gameState.currentTurnIndex] === socket.id) {
                    setTurnStatus('YourTurn');
                } else {
                    setTurnStatus('OpponentTurn');
                }

                console.log(currentTrick);
            }

            socket.on('getWinningStateResponse', (response) => { 
                console.log(response);
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

    return (
        //<Context.Provider value={positionMatrix}>
            <Layout>
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
                                    ></Card>    
                                </Column>
                            </Row>
                        </CardGroup>
                        <CardGroup>
                            <Row>
                                {currentTrick.map((data, index) => (
                                    <Column key={`trick-column-${index}`}>
                                        <Card 
                                            Card={data} 
                                            uniqueID={`current-trick-card-${index+1}`}
                                            origin={`player-card-${data?.index+1}`}
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
        //</Context.Provider>
        );
}

export default CardGameBoard