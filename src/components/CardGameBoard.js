import React, { useState, useEffect }from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket.js';
import { Layout, Score, CardGroup, CardContainer, CardImage, Row, Column } from './Layout';


function CardGameBoard() {
    const [gameState, setGameState] = useState(null);
    const { roomID } = useParams();
    const state = {
        card1ImageUrl: null,
        card2ImageUrl: null,
        card3ImageUrl: null
    }

    useEffect(() => {
        // Listen for the startGame event from the server
        socket.emit('startGame', { gameID: roomID });
        socket.on('getGameStateResponse', (response) => {
            console.log('Client received getGameResponse');
            if (response.success) {
                const gameState = response.gameState;
                console.log(gameState[socket.id])
            } else {
            console.error(response.error);
            }
        })
    }, []);

    return (
        <Layout>
            <Column>
                <Row>
                    <Score>
                        <div>Nuno</div>
                        <div>Points: 0</div>
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
                                    <CardImage src={'https://deckofcardsapi.com/static/img/back.png'} alt="P2Card1"></CardImage> 
                                </CardContainer>
                            </Column>
                        </Row>
                    </CardGroup>
                    <CardGroup>
                        <Row>
                            <Column>
                                <CardContainer> 
                                   
                                </CardContainer>
                            </Column>
                            <Column>
                                <CardContainer> 
                                   
                                </CardContainer>
                            </Column>
                        </Row>
                    </CardGroup>
                </Row>
                <Row>
                <   Score>
                        <div>Timothy</div>
                        <div>Points: 0</div>
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
                                    <CardImage src={'https://deckofcardsapi.com/static/img/back.png'} alt="P2Card1"></CardImage> 
                                </CardContainer>
                            </Column>
                            <Column>
                                <CardContainer> 
                                    <CardImage src={'https://deckofcardsapi.com/static/img/back.png'} alt="P2Card1"></CardImage> 
                                </CardContainer>
                            </Column>
                        </Row>
                    </CardGroup>
                </Row>
            </Column>
        </Layout>
        );
}

export default CardGameBoard