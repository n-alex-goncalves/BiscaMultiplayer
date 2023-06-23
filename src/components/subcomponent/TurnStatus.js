import React from 'react';
import { motion } from 'framer-motion';

const TurnStatus = ({ turnStatus }) => {
  const yourTurnClass = 'your-turn';
  const opponentTurnClass = 'opponent-turn';
  const id = turnStatus ? yourTurnClass : opponentTurnClass;

 const variants = {
    show: {
      opacity: 1,
      y: 0,
      transition: {
        ease: 'easeOut',
        duration: 0.3
      }
    },
    hide: {
      y: -20,
      opacity: 0
    }
  };

  return (
    <motion.div className={id} key={id} variants={variants} animate={'show'} initial="hide">
      {turnStatus === 'YourTurn' ? 'YOUR TURN' : 'OPPONENT\'S TURN'}
    </motion.div>
  );
};

export default TurnStatus;