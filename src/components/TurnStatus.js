import React from 'react';

const TurnStatus = ({ turnStatus }) => {
  const yourTurnClass = 'your-turn';
  const opponentTurnClass = 'opponent-turn';

  return (
    <div>
      {turnStatus === 'YourTurn' ? (
        <div className={yourTurnClass}>
          <p>YOUR TURN</p>
        </div>
      ) : (
        <div className={opponentTurnClass}>
          <p>OPPONENT'S TURN</p>
        </div>
      )}
    </div>
  );
};

export default TurnStatus;