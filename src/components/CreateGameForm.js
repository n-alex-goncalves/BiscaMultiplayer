import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

import DOMPurify from 'dompurify';
import socket from '../socket.js';
import '../assets/CreateGameForm.css';

import image01 from '../img/bisca_point_system.PNG'
// import image02 from '../img'

const CreateGameForm = () => {
  const [name, setName] = useState('');
  const [gameID, setGameID] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showHelpMessage, setShowHelpMessage] = useState(false);

  const navigate = useNavigate();

  const handleHelpMessage = () => {
    setShowHelpMessage(!showHelpMessage);
  };

  useEffect(() => {
    socket.on('createRoomResponse', (response) => {
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: name });
      } else {
        console.error(response.error);
      }
    });

    socket.on('joinRoomResponse', (response) => {
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: name });
      } else {
        setShowErrorMessage(true);
        setTimeout(() => { setShowErrorMessage(false); }, 2500);
        console.error(response.error);
      }
    }, [name]);

    return () => {
      socket.off('createRoomResponse');
      socket.off('joinRoomResponse');
    };
  }, [name]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name.trim() === '') {
      setErrorMessage('Please enter a valid name.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }
    socket.emit('createGameRoom', (response) => {
      console.log('Client received callback function');
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: name });
      } else {
        setErrorMessage('Failed to create a game room.');
        console.error(response.error);
      }
    });
  };

  const handleGameCode = async (event) => {
    event.preventDefault();

    if (name.trim() === '') {
      setErrorMessage('Please enter a valid name.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }

    if (gameID.trim() === '') {
      setErrorMessage('Please enter a valid game code.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }

    socket.emit('joinGameRoom', ({ gameID: gameID }), (response) => {
      console.log('Client received callback function');
      if (response.success) {
        navigate(`/waiting/${gameID}`, { state: name });
      } else {
        setErrorMessage('Game code does not exist.');
        setShowErrorMessage(true);
        setTimeout(() => { setShowErrorMessage(false); }, 2500);
        console.error(response.error);
      }
    })

  };

  const GameTitle = () => {
    return (
      <motion.div
        className="titleContainer"
        initial={{ scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        style={{ fontSize: '3rem', marginBottom: '40px', marginTop: '70px', fontWeight: 'bold', fontFamily: "Helvetica, sans-serif" }}
        transition={{ type: "spring", stiffness: 200, damping: 17 }}
      >
        BISCA!
      </motion.div>
    )
  }
  
  const AccordionMenu = () => {
    const [activeIndex, setActiveIndex] = useState(null);
  
    const handleAccordionClick = (index) => {
      setActiveIndex(index === activeIndex ? null : index);
    };
  
    const accordionItems = [
      {
        title: 'INTRODUCTION',
        content: `<b>Bisca</b> is a popular card game that originated in <b>Portugal</b> and is played in many other countries such as Spain, Italy, Cape Verde, Angola, etc. The game is similar to the Italian Briscola or the Spanish Brisca.

        Some variations of Bisca can be played in teams between 4 people, but in this case, the website only hosts the two player version.

        The origins of <b>Bisca</b> are uncertain, but it is believed to have evolved from the earlier Italian card game, <b>Briscola</b>, during a period of cultural exchange between the two countires.
        
        Bisca is played with a 40 card-deck, and the aim is to achieve as many points from card tricks as possible. How the game works is described in the following sections.`
      },
      {
        title: 'PLAYERS AND CARDS',
        content: `Each player draws <b>three</b> cards from the deck, and <b>one</b> additional card is drawn as the <b>trump card</b> at the centre of the board.

        The <b>trump card</b> determines the suit that can win any trick. This means that if you play a card of the same suit as the trump card (and your opponent does not), you win the trick.
        
        If both players play cards of the same suit, the player with the <b>highest</b> value card of that suit wins the trick (note that this happens if both players play the suit of the trump card).
        
        If neither player plays a card of the trump suit, and both players play cards of different suits, the first player who played a card wins the trick.
        
        The points system for the game is shown above.`,
        image: image01,
      },
      {
        title: 'TACTICS',
        content: `Here are a couple of tactics to secure some wins.

        1. <b>Keep track of the played cards:</b> Keeping track of the cards is crucial in Bisca. By remembering the cards played, you can better estimate the cards that the opponent has. Try to remember the high-ranking cards, especially the Ace and 7. Save those cards in your hand for key moments.

        2. <b>Keep a balanced hand:</b> Keeping a balanced hand of different values/suits allows you to adapt to different situations and play strategically, regardless of whether you're losing or winning. Avoid having too many high-ranking cards or too many low-ranking cards, as this will limit your options.

        3. <b>Use the Monte Carlo strategy:</b> This tactic is a little more complicated, but generally, by playing the value of the last card played, or the mean value of the cards played so far, the player has a greater probability of winning. By taking into account the previous cards played via an average, you can better estimate what cards to play and what cards you can win.`,
      },
      {
        title: 'ACKNOWLEDGEMENTS & CREDITS',
        content: `Martini Sunset - Written by Anonymous. Relaxed, jazzy and inspiring track made with warm piano, light drums and bass. Simple, upbeat and passionate. This music is available for commercial and non-commercial purposes. https://freepd.com/misc.php`,
      }
    ];

    return (
      <div className='accordion-menu'>
        {accordionItems.map((item, index) => (
          <div key={index} className='accordion-menu-item'>
            <div className='accordion-menu-header' onClick={() => handleAccordionClick(index)}>
              <h3>{item.title}</h3>
              <span>{index === activeIndex ? '-' : '+'}</span>
            </div>
            {index === activeIndex && (
              <div className='accordion-menu-content'>
                {item.image && <div className='accordion-menu-image'>
                  <img src={item.image} alt={item.title} />
                </div>}
                <div className='accordion-menu-text'>
                  <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content)}}></p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="create-game-form-container">
      {GameTitle()}
      <motion.div
        className="formContainer"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.7
        }}
      > 
        <form onSubmit={handleSubmit}>
          <div className="create-game-form-input-container">
            <label htmlFor="name" className="create-game-form-label">Player Name:</label>
            <input type="text" id="name" placeholder="e.g., John" value={name} onChange={(event) => setName(event.target.value)} className="create-game-form-input" />
          </div>
          <button type="submit" className="create-game-form-button">CREATE GAME</button>
        </form>

        <form onSubmit={handleGameCode}>
          <div className="create-game-form-input-container">
            <label htmlFor="gameID" className="create-game-form-label">Game Code:</label>
            <input type="text" id="gameID" placeholder="e.g., zdh3fj" value={gameID} onChange={(event) => setGameID(event.target.value)} className="create-game-form-input" />
          </div>
          <button type="submit" className="join-game-form-button">JOIN VIA CODE</button>
        </form>

        <motion.button
            className='help-game-form-button'
            onClick={handleHelpMessage}
        >
            HOW TO PLAY
        </motion.button>
        {showHelpMessage && (
        <motion.div
          className='full-screen-box'
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 17 }}
        >
          <div className='close' onClick={handleHelpMessage}></div>
          <div className='full-screen-box-content'>
            <h2>HOW TO PLAY</h2>
            <AccordionMenu />
          </div>
        </motion.div>
      )}
      </motion.div>
    </div>
  );
}

export default CreateGameForm;

/**




Ace                                        11 Points
Seven (a.k.a Bisca)                        10 Points
King                                        4 Points
Jack                                        3 Points
Queen                                       2 Points
The rest of the cards (6, 5, 4, ...)        1 Points


Each player draws three cards, and one other card is drawn as the trump card.

The trump card defines the suit that can win any trick. By playing a card of the
same suit as the trump card, anyone can win any trick.

If both players play the same suit however, the player with the highest value card wins the 
trick. 

If neither player plays the trump suit, and both players play a card with a different suit, 
the first player wins the trick.

The points system is shown to the left. Remember! The game is played with only a 40-card deck, so
all the 8s, 9s and 10s are removed.



Each player draws three cards from the deck, and one additional card is drawn as the trump card.

The trump card determines the suit that can win any trick. This means that if you play a card of the same suit as the trump card and your opponent does not, you win the trick.

If both players play cards of the same suit, the player with the highest value card of that suit wins the trick (note that this includes the trump card).

If neither player plays a card of the trump suit, and both players play cards of different suits, the first player who played a card wins the trick.

The points system for the game is shown on the left. 

INTRODUCTION

Bisca is a popular card game that originated in Portugal and is played in many other
countries such as Spain, Italy, Cape Verde, Angola, etc. The game
is similar to the Italian Briscola or the Spanish Brisca.

The origins of Bisca are uncertain, but it is believed to have evolved from the earlier Italian 
card game, Briscola, during a period of cultural exchange between the two countires.

Bisca is played with a 40 card-deck, and the aim is to achieve as many points from card tricks as possible. 
The points system is described in the following sections.


The primary goal is to get the most valuable card tricks possible. A trick are the
cards played onto the board.

The points system is as follows:




- Bisca is a Portuguese card trick game
- Similar to Italian Briscola or the variant Sueca.
  
- each player is dealt 3 cards and one card is the trup card.

- A trick is the 

- Each individual player should aim to win card tricks
- The value of the points are 

 */