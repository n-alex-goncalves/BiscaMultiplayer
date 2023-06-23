import React, { useState } from 'react';
import { Form, Button, Accordion, Image } from 'react-bootstrap'

import DOMPurify from 'dompurify';
import '../../assets/CreateGameForm.css';

import bisca_point_img from '../../img/bisca_point_system.png'
import { AnimatePresence, motion } from 'framer-motion';

const AccordionMenu = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const accordionItems = [
    {
      title: 'INTRODUCTION',
      content: `<strong>Bisca</strong> is a popular card game that originated in <b>Portugal</b> and is played in many other countries such as Spain, Italy, Cape Verde, Angola, etc. The game is similar to the Italian Briscola or the Spanish Brisca.<br><br>
      Some variations of Bisca can be played in teams between 4 people, but in this case, the website only hosts the two player version.<br><br>
      The origins of <b>Bisca</b> are uncertain, but it is believed to have evolved from the earlier Italian card game, <b>Briscola</b>, during a period of cultural exchange between the two countires.<br><br>
      Bisca is played with a 40 card-deck, and the aim is to achieve as many points from card tricks as possible. How the game works is described in the following sections.`
    },
    {
      title: 'PLAYERS AND CARDS',
      content: `Each player draws <b>three</b> cards from the deck, and <b>one</b> additional card is drawn as the <b>trump card</b> at the centre of the board.<br><br>
      The <b>trump card</b> determines the suit that can win any trick. This means that if you play a card of the same suit as the trump card (and your opponent does not), you win the trick.<br><br>
      If both players play cards of the same suit, the player with the <b>highest</b> value card of that suit wins the trick (note that this happens if both players play the suit of the trump card).<br><br>
      If neither player plays a card of the trump suit, and both players play cards of different suits, the first player who played a card wins the trick.<br><br>
      The points system for the game is shown above.`,
      image: bisca_point_img
    },
    {
      title: 'TACTICS',
      content: `Here are a couple of tactics to secure some wins.<br><br>
      1. <b>Keep track of the played cards:</b> Keeping track of the cards is crucial in Bisca. By remembering the cards played, you can better estimate the cards that the opponent has. Try to remember the high-ranking cards, especially the Ace and 7. Save those cards in your hand for key moments.<br><br>
      2. <b>Keep a balanced hand:</b> Keeping a balanced hand of different values/suits allows you to adapt to different situations and play strategically, regardless of whether you're losing or winning. Avoid having too many high-ranking cards or too many low-ranking cards, as this will limit your options.<br><br>
      3. <b>Use the Monte Carlo strategy:</b> This tactic is a little more complicated, but generally, by playing the value of the last card played, or the mean value of the cards played so far, the player has a greater probability of winning. By taking into account the previous cards played via an average, you can better estimate what cards to play and what cards you can win.`,
    },
    {
      title: 'ACKNOWLEDGEMENTS & CREDITS',
      content: `Below are some of the technologies/resources/inspirations used to build the project. Thanks go to the following:<br><br>
      - <b>freepd</b>: Free-public domain music used. (The music can be found at: https://freepd.com/misc.php)<br>
      - <b>Node.js</b>: An open-source JavaScript runtime environment.<br>
      - <b>React</b>: A popular JavaScript library for building user interfaces.<br>
      - <b>React Bootstrap</b>: A front-end framework for React.<br>
      - <b>Framer Motion</b>: A powerful animation library for React.<br>
      - <b>Deck of Cards API</b>: An API that provides a deck of cards objects.<br>
      - <b>font-awesome</b>: An icon library toolkit for CSS.<br>
      - <b>oombi.io</b>: A well-designed multiplayer game that inspired this project.`
    }
  ];

  return (
      <div>
        <Form onClick={toggleMenu}>
          <Button className="mb-3 help-game-form-button" type="button">HOW TO PLAY</Button>
        </Form>
        <AnimatePresence>
          {showMenu && (
              <motion.div
                className='full-screen-box overflow-auto'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 17 }}
              >
                <div className='close' onClick={toggleMenu}></div>
                <div class="h3 mt-4 mb-4" style={{ color: "white" }}>HOW TO PLAY</div>
                <Accordion defaultActiveKey="0">
                  {accordionItems.map((item, index) => (
                    <Accordion.Item eventKey={index}>
                      <Accordion.Header>
                        {item.title}      
                      </Accordion.Header>
                      <Accordion.Body>
                        {item.image && <Image className="float-start mr-5" style={{ maxWidth: "400px", marginRight: "18px", border: "2px solid black"}} src={item.image}></Image>}
                        <p class="text-start" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content)}}></p>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </motion.div>)}
        </AnimatePresence>
      </div>
    );
};

export default AccordionMenu;