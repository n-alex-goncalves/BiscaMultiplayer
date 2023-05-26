import React from 'react';
import Card from './Card'; // Import the Card component
import NoCardsRemainingMessage from './NoCardsRemaining';

const Deck = ({ remainingCards }) => {
  return (
     <div>
        <div key={`deck-card-row`} id={'deck'} style={{ display: 'grid' }}>
        <div style={{ display: 'flex', overflowY: 'visible', gridColumn: '1', marginLeft: '35%', gridRow: '1', width: '50%' }}>
            <Card 
                Card={{ image:'https://deckofcardsapi.com/static/img/back.png' }}
                uniqueID={`current-trick-card-${1+1}`}
                exit={{ scale: 0, opacity: 0, rotate: 180 }}
                rotate={true}
            ></Card>
          </div>
          {Array.from({ length: Math.min(remainingCards, 5) }, (_, index) => {
            const offset = 1.5 * (index);
            return (
              <div key={`deck-card-column-${index+1}`} style={{ overflowY: 'visible', overflowX: 'auto', scrollbarWidth: 'none', width: `50%`, marginLeft: `${offset}vw`, gridColumn: '1', gridRow: '1' }}>
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
      </div>

  );
}


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