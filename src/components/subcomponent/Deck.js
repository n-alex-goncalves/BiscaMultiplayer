import React from 'react';
import Card from './Card'; // Import the Card component

const Deck = ({ remainingCards }) => {
  // Calculate the total width of the stacked cards
  const totalWidth = (34 - 1) * 5 + 10; // Assuming each card has a width of 100px and an offset of 5px

  return (
    <div key={`deck-card-row`} id={'deck'} style={{ display: 'grid', maxWidth: `${totalWidth}px`, marginLeft: "40px", marginRight: "50px", width: '125px', height: '180px' }}>
      {Array.from({ length: Math.min(remainingCards, 5) }, (_, index) => {
        const offset = 10 * index;
        return (
          <div key={`deck-card-column-${index+1}`} style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', width: `${totalWidth}px`, marginLeft: `${offset}px`, gridColumn: '1', gridRow: '1' }}>
            <Card
              key={`deck-card-${index+1}`}
              Card={{ image:'https://deckofcardsapi.com/static/img/back.png' }}
              uniqueID={`deck-card-${index+1}`}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Deck;