import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import "../../assets/ImageGrid.css";

// Retrieve the bisca value of card based on its original value
const getValue = (card) => {
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
        {images.map((image, index) => (getValue(image) > 0 &&
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

export default ImageGrid;