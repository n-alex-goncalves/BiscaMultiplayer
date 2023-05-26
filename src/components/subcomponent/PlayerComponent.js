import React from 'react';
import { Score, CardGroup } from '../Layout.js';
import { Row, Col } from 'react-bootstrap'
import Card from './Card';

const PlayerComponent = ({ name, points, cards }) => {
    return (
        <Row className="align-items-center mt-4 p-4">
            <Col > 
                <Score>
                    <div>{name}</div>
                    <div>Points: {points}</div>
                </Score>
            </Col>
            <Col xs={12} sm={8}>
                <CardGroup className="p-2 p-md-4 mt-4">
                    <Row>
                        {cards.map((data, index) => (
                        <Col key={`card-column-${index}`}>
                            <Card
                                Card={ data && { image: 'https://deckofcardsapi.com/static/img/back.png' }}
                                uniqueID={`opponent-card-${index+1}`}
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