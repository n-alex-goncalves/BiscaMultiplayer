import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CardContainer } from '../Layout.js';

import placeholder_img from './placeholder_green.png'

const Placeholder = () => (
  <CardContainer style={{ zIndex: -1, position: 'relative' }}>
    <motion.img
        src={placeholder_img}
        style={{ width: "100%", height: "100%", scale: "cover" }}
    />
  </CardContainer>
)

const CardComponent = ({ cardData, exitAnimation, onClick, initial, enableRotation = false })  => {
  return (
    <motion.div
      style={{ zIndex: 1, position: 'relative' }}
      initial={initial}
      animate={{ x: 0, y: 0, rotate: enableRotation ? 90 : 0 }}
      exit={exitAnimation}
      transition={{ type: "spring", bounce: 0.5, duration: 1 }}
    >
      <CardContainer onClick={onClick}>
        <motion.img
            src={cardData.image}
            style={{ width: "100%", height: "100%", scale: "cover" }}
        />
      </CardContainer>
    </motion.div>
  )
}

const Card = ({ cardID, cardData, exitAnimation = {}, onClick = () => {}, animateFrom = 'deck', enableRotation = false }) => {
  const initial = { x: 0, y: 0, rotate: enableRotation ? 90 : 0 }

  console.log(animateFrom);
  
  const initialPosition = () => {
      const originElement = document.getElementById(animateFrom); 
      const cardElement = document.getElementById(cardID);
      if (originElement && cardElement) {
        const originRect = originElement.getBoundingClientRect();
        const destinationRect = cardElement.getBoundingClientRect(); 
        const deckX = originRect.left - destinationRect.left;
        const deckY = originRect.top  - destinationRect.top;
        initial.x = deckX;
        initial.y = deckY;
      }
  }

  initialPosition();

  return (
    <div id={cardID}>
      <AnimatePresence mode='wait'>
        {cardData && cardData?.isVisible ? ( 
          <CardComponent 
            key={cardID} 
            cardData={cardData} 
            exitAnimation={exitAnimation}
            initial={initial} 
            onClick={onClick} 
            enableRotation={enableRotation}/>
          ) : (
            <Placeholder key={cardID + '-placeholder'}/>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Card;