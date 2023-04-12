import React, { useState, useEffect }from 'react';
import { useParams } from 'react-router-dom';
import socket from '../socket.js';
import { Layout, Score, CardGroup, CardContainer, CardImage, Row, Column } from './Layout';


function CardGameBoard() {
    // const [gameStarted, setGameStarted] = useState(false);
    // const [gameState, setGameState] = useState(null);
    const { roomID } = useParams();

    const [playerName, setPlayerName] = useState('');
    const [playerPoints, setPlayerPoints] = useState(0);
    const [playerCards, setPlayerCards] = useState([]);

    const [opponentName, setOpponentName] = useState('');
    const [opponentPoints, setOpponentPoints] = useState(0);
    const [opponentCards, setOpponentCards] = useState([]);

    const [trumpCard, setTrumpCard] = useState(null);
    const [currentTrick, setCurrentTrick] = useState([]); 

    useEffect(() => {
        // Listen for the startGame event from the server
        socket.emit('getGameState', { gameID: roomID });
        
        socket.on('getGameStateResponse', (response) => {
            if (response.success) {
                console.log('RECEIVED RESPONSE')
                const { gameState } = response;
                
                // Set player's name
                const playerState = gameState.players[socket.id];
                const playerName = playerState.name;
                setPlayerName(playerName);

                // Set player's hand
                const playerCards = playerState.hand.cards;
                setPlayerCards(playerCards);

                // Set player's points
                const playerScore = playerState.score
                setPlayerPoints(playerScore)

                // Set opponent's name
                const opponentID = Object.keys(gameState.players).find(id => id !== socket.id);
                const opponentState = gameState.players[opponentID];
                const opponentName = opponentState.name;
                setOpponentName(opponentName);

                // Set opponent's hand
                const opponentCards = opponentState.hand.cards;
                setOpponentCards(opponentCards);

                // Set opponent's points
                const opponentScore = gameState.players[opponentID].score;
                setOpponentPoints(opponentScore);

                // Set trump card
                const trumpCard = gameState.trumpCard.cards[0];
                setTrumpCard(trumpCard);
                
                // Update state object with current trick cards
                const currentTrick = gameState.currentTrick
                setCurrentTrick(currentTrick);
            }
        });
        
        // Clean up the event listener when the component unmounts
        return () => {
          socket.off('getGameStateResponse');
        };
    }, []);

    const handleCardSelection = (card, index) => {
        const data = {
            card: card,
            index: index,
            gameID: roomID,
        }
        socket.emit('onCardSelected', data);
    }

    return (
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
                                {data && <CardContainer> 
                                    <CardImage src={data?.image} alt={`Card ${index+1}`}></CardImage> 
                                </CardContainer>}
                            </Column>
                            ))}
                        </Row>
                    </CardGroup>
                </Row>
                <Row>
                    <CardGroup>
                        <Row>
                            <Column>
                                <CardContainer> 
                                    <CardImage src={'https://deckofcardsapi.com/static/img/back.png'} alt="Deck 1"></CardImage> 
                                </CardContainer>
                            </Column>
                            <Column>
                                <CardContainer> 
                                    <CardImage src={trumpCard?.image} alt="TrumpCard 1"></CardImage> 
                                </CardContainer>
                            </Column>
                        </Row>
                    </CardGroup>
                    <CardGroup>
                        <Row>
                            {currentTrick.map((data, index) => (
                            <Column key={`trick-column-${index}`}>
                                {data && <CardContainer> 
                                            <CardImage src={data?.image} alt={`Trick ${index+1}`}></CardImage> 
                                </CardContainer>}
                            </Column>
                            ))}
                        </Row>
                    </CardGroup>
                </Row>
                <Row>
                    <Score>
                        <div>{playerName}</div>
                        <div>Points: {playerPoints}</div>
                    </Score>
                    <CardGroup>
                        <Row>
                            {playerCards.map((data, index) => (
                            <Column key={`card-column-${index}`}>
                                {data && <CardContainer isPlayer={true}> 
                                    <CardImage src={data?.image} alt={`Card ${index+1}`} onClick={() => handleCardSelection(data, index)}></CardImage> 
                                </CardContainer>}
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