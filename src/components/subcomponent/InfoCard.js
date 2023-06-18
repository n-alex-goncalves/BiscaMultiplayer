import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../../assets/ImageGrid.css";

const getPoints = (card) => {
  switch (card.value) {
      case "ACE":
          return 11;
      case "KING":
          return 4;
      case "JACK":
          return 3;
      case "QUEEN":
          return 2;
      case "7": // Bisca
          return 10;
      default: // Palha
          return 0;
  }
};

const ImageGrid = ({ images }) => {
  return (
    <div className="image-grid">
      <AnimatePresence>
        {images.map((image, index) => (getPoints(image) > 0 &&
          (<motion.img
            key={index}
            src={image.image}
            alt={image.code}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid-item"
          ></motion.img>)
        ))}
      </AnimatePresence>
    </div>
  );
};

const NameTitle =  ({ playerName }) => {
    return (
        <motion.div 
            style={{ color: 'white', zIndex: '9999' }} 
            initial={{ opacity: 1 }} 
            exit={{ opacity: 0 }}>
                <h1>{playerName}</h1>
        </motion.div>)
}

const InfoCard = ({ playerName, points, cardsWon }) => {
    const [isOpen, setIsOpen] = useState(false);

    const variants = {
        default: {
            opacity: 1
        },
        open: {
          height: '410px',
          width: '350px',
          paddingTop: '10px',
          transition: { type: "spring", stiffness: 200, damping: 17 }
        }
    };    

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            style={{ marginTop: '120px', position: 'absolute' }}
        >
            {!isOpen && <NameTitle playerName={playerName}></NameTitle>}
            <motion.div
                className='grid-box'
                variants={variants}
                whileHover='open'
                initial='default'
                onMouseEnter={() => setIsOpen(!isOpen)}
                onMouseLeave={() => setIsOpen(!isOpen)}
            >
                 <h2 style={{ whiteSpace: 'nowrap' }}>POINTS: {points}</h2>
                {isOpen && <ImageGrid images={cardsWon}></ImageGrid>}
            </motion.div>
        </motion.div>
    );
};

export default InfoCard;