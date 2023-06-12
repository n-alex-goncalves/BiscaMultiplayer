import React from 'react';
import Card from './Card';
import { Row, Col } from 'react-bootstrap'
import NoCardsRemainingMessage from './NoCardsRemaining';
import '../../assets/Deck.css';
import { CardGroup } from '../Layout.js';

const Deck = ({ remainingCards, trumpCard }) => {
  return (
    <CardGroup className="p-4 h-100">
      <Row>
        <div key={`deck-card-row`} id={'deck'} style={{ display: 'grid' }}>
          <div className='grid-trump'>
              <Card
                  Card={trumpCard}
                  uniqueID={`trump-card`}
                  exit={{ scale: 0, opacity: 0, rotate: 180 }}
                  rotate={true}
                  origin={'deck'}
              ></Card>
          </div>
          {Array.from({ length: Math.min(remainingCards, 5) }, (_, index) => {
            const offset = 1.5 * (index);
            return (
              <div key={`deck-card-column-${index+1}`} style={{ overflowY: 'visible', overflowX: 'auto', scrollbarWidth: 'none', width: `50%`, marginLeft: `${offset}vw`, gridColumn: '1', gridRow: '1' }}>
                <Card
                  key={`deck-card-${index+1}`}
                  Card={{ image: 'https://deckofcardsapi.com/static/img/back.png' }}
                  uniqueID={`deck-card-${index+1}`}
                />
              </div>
            );
          })}
        </div>
      </Row>
    </CardGroup>
  );
}

// deck-card-row
// grid-trump-card
//         {remainingCards === 0 && <NoCardsRemainingMessage duration={1500}/>}        {remainingCards === 0 && <NoCardsRemainingMessage duration={1500}/>}

export default Deck;

/*

 <Col xs={4} md={6}>
                            <CardGroup className="p-5">
                                <Row>
                                    {currentTrick.map((data, index) => (
                                        <Col id={`trick-column-${index}`}>
                                            <Card 
                                                Card={{ image:'https://deckofcardsapi.com/static/img/back.png' }}
                                                uniqueID={`current-trick-card-${index+1}`}
                                                origin={data?.cardOwnership === socket?.id ? `player-card-${data?.index+1}` : `opponent-card-${data?.index+1}`}
                                                exit={{ scale: 0, opacity: 0, rotate: 180 }}
                                            ></Card>
                                        </Col>
                                    ))}
                                </Row>
                            </CardGroup>
                        </Col>

    <CardGroup className="p-2 p-md-4">
     <Row>
        <div key={`deck-card-row`} id={'deck'} style={{ display: 'grid', width: `500px` }}>
          {Array.from({ length: Math.min(remainingCards, 5) }, (_, index) => {
            const offset = 10 * index;
            return (
              <div key={`deck-card-column-${index+1}`} style={{ display: 'flex', overflowY: 'visible', overflowX: 'auto', scrollbarWidth: 'none', width: `100%`, marginLeft: `${offset}px`, gridColumn: '1', gridRow: '1' }}>
                <Card
                  key={`deck-card-${index+1}`}
                  Card={{ image:'https://deckofcardsapi.com/static/img/back.png' }}
                  uniqueID={`deck-card-${index+1}`}
                />
              </div>
            );
          })}
        </div>
        {remainingCards === 0 && <NoCardsRemainingMessage duration={1500}/>}
      </Row>
    </CardGroup>
*/