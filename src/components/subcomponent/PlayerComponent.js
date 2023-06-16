import React from 'react';
import { Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import { Score, CardGroup } from '../Layout.js';

import Card from './Card';
import socket from '../../socket.js';

const PlayerComponent = ({ name, points, cards, isPlayer }) => {
    const { roomID } = useParams();

    const handleCardSelection = (card, index) => {
        const data = {
            card: card,
            index: index,
            gameID: roomID,
        }
        socket.emit('onCardSelected', data);
    }

    return (
        <Row className="align-items-center p-4 mt-4">
            <Col> 
                <Score>
                    <div>{name}</div>
                    <div>Points: {points}</div>
                </Score>
            </Col>
            <Col xs={12} sm={9}>
                <CardGroup className="p-4">
                    <Row>
                        {cards.map((data, index) => (
                            <Col key={`card-column-${index}`}>
                                <Card
                                    cardID={ isPlayer ? `player-card-${index+1}` : `opponent-card-${index+1}`}
                                    cardData={ isPlayer ? data : data && { image: 'https://deckofcardsapi.com/static/img/back.png', isVisible: true }  }
                                    onClick={ isPlayer ? () => handleCardSelection(data, index) : () => {} }
                                ></Card>
                            </Col>
                        ))}
                    </Row>
                </CardGroup>
            </Col>
        </Row>
    );
};

export default PlayerComponent;