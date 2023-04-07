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

    const [opponentName, setOpponentName] = useState('');
    const [opponentPoints, setOpponentPoints] = useState(0);

    const [trumpCard, setTrumpCards] = useState(null)

    const [currentTrick, setCurrentTrick] = useState([]); 
    const [cardImageUrls, setCardImageUrls] = useState([]);

    useEffect(() => {
        // Listen for the startGame event from the server
        socket.emit('getGameState', { gameID: roomID });
        
        socket.on('getGameStateResponse', (response) => {
            if (response.success) {
                const { gameState } = response;
                
                // Set player's name
                const playerState = gameState.players[socket.id];
                const playerName = playerState.name
                setPlayerName(playerName);

                // Set player's points
                const playerScore = playerState.score
                setPlayerPoints(playerScore)

                // Set opponent's name
                const opponentID = Object.keys(gameState.players).find(id => id !== socket.id);
                const opponentName = gameState.players[opponentID].name;
                setOpponentName(opponentName);

                // Set opponent's points
                const opponentScore = gameState.players[opponentID].score
                setOpponentPoints(opponentScore)

                // Set trump card
                const trumpCard = gameState.trumpCard.cards[0]
                setTrumpCards(trumpCard.image)
                
                // Update state object with current trick cards
                const currentTrick = gameState.currentTrick.map(card => card?.image);
                setCurrentTrick([null, null]);

                // Update state object with card image URLs
                const cardImageUrls = playerState.hand.cards.map(card => card?.image);
                setCardImageUrls(cardImageUrls);
            }
        });
        
        // Clean up the event listener when the component unmounts
        return () => {
          socket.off('getGameStateResponse');
        };
    }, []);

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
                            <Column>
                                <CardContainer> 
                                    <CardImage src={'https://deckofcardsapi.com/static/img/back.png'} alt="P2Card1"></CardImage> 
                                </CardContainer>
                            </Column>
                            <Column>
                                <CardContainer> 
                                    <CardImage src={'https://deckofcardsapi.com/static/img/back.png'} alt="P2Card2"></CardImage> 
                                </CardContainer>
                            </Column>
                            <Column>
                                <CardContainer>
                                    <CardImage src={'https://deckofcardsapi.com/static/img/back.png'} alt="P2Card3"></CardImage> 
                                </CardContainer>
                            </Column>
                        </Row>
                    </CardGroup>
                </Row>
                <Row>
                    <CardGroup>
                        <Row>
                            <Column>
                                <CardContainer> 
                                    <CardImage src={'https://deckofcardsapi.com/static/img/back.png'} alt="P2Card1"></CardImage> 
                                </CardContainer>
                            </Column>
                            <Column>
                                <CardContainer> 
                                    <CardImage src={trumpCard} alt="P2Card1"></CardImage> 
                                </CardContainer>
                            </Column>
                        </Row>
                    </CardGroup>
                    <CardGroup>
                        <Row>
                        {currentTrick.map((url, index) => (
                        <Column key={`trick-column-${index}`}>
                            {url && <CardContainer> <CardImage src={'https://deckofcardsapi.com/static/img/back.png'} alt={`Trick ${index+1}`}></CardImage> </CardContainer>}
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
                            {cardImageUrls.map((url, index) => (
                            <Column key={`card-column-${index}`}>
                                <CardContainer> 
                                <CardImage src={url} alt={`Card ${index+1}`}></CardImage> 
                                </CardContainer>
                            </Column>
                            ))}
                        </Row>
                    </CardGroup>
                </Row>
            </Column>
        </Layout>
        );
}


/**


))}

 */

export default CardGameBoard