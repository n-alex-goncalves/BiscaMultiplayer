import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageGrid from './ImageGrid.js';

const InfoCard = ({ playerName, points, cardsWon }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleOpen = () => {
        setIsOpen(!isOpen);
    };

    const variants = {
        initial: {
          opacity: 1
        },
        default: {
            opacity: 1
        },
        open: {
          height: '410px',
          width: '350px',
          transition: {type: "spring", stiffness: 200, damping: 17 }
        }
    };    

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            style={{ marginTop: '120px', position: 'absolute' }}
        >
            {!isOpen && <motion.h2 style={{ color: 'white', zIndex: '9999' }} initial={{ opacity: 1 }} exit={{ opacity: 0 }}>{playerName}</motion.h2>}
            <motion.div
                className='endCard'
                style={{
                    width: '200px',
                    height: '90px',
                    marginTop: '20px',
                    backgroundColor: 'white',
                    borderRadius: '5px',
                    padding: '5px 12px',
                }}
                variants={variants}
                whileHover='open'
                initial='initial'
                animate='default'
                onMouseEnter={handleOpen}
                onMouseLeave={handleOpen}
            >
                <motion.h2>POINTS: {points}</motion.h2>
                {isOpen && (<ImageGrid images={cardsWon}></ImageGrid>)}
            </motion.div>
        </motion.div>
    );
};

export default InfoCard;