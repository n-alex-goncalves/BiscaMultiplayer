# Bisca Portuguese Card Trick Game

This is a web-based multiplayer implementation of the Bisca Portuguese card trick game.

- Real-time gameplay with interactive animations using Framer Motion.
- Dynamic deck of cards rendered from the Deck of Cards API.
- User-friendly interface with intuitive game mechanics.
- Score tracking with in-game card history.

## Table of Contents
- [Demo](#demo)
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Areas of Improvement](#areas-for-improvement)

## Demo

## Overview
Bisca is a Portuguse card game that focuses on winning card-tricks. The game
is popular in many countries, such as Portugal, Spain, Italy, Cape Verde, Angola, etc. The game is similar to its Italian equivalent, Briscola.

The origins of Bisca are unclear, but it is believed to have originated from the Italian equivalent during a period of cultural exchange between the two countries 
in the 16th century.

The game starts with both players being dealt three cards, and one additional card being drawn as the trump card. 

The implementation provided is a complete online equivalent of the game, allowing users to connect online and play against one another. The game features dynamic spring animation courtesy of Framer Motion, and the dynamic card renders courtesy of the Deck of Cards API.

## Installation
[Provide instructions on how to install and set up your game locally. Include any dependencies or system requirements.]

[git clone []
npm run start 
localhost:3000
]

[
npm run build]

## Technologies Used
- Node.js: An open-source JavaScript runtime environment.
- React: A popular JavaScript library for building user interfaces.
- React Bootstrap: A front-end framework that replaces Bootstrap JavaScript
- Framer Motion: A powerful animation library for React.
- Deck of Cards API: An API that provides a deck of cards for use in web applications.

## Acknowledgements
- font-awesome: An icon library toolkit for CSS
- oombi: A well-designed multiplayer game that inspired this project
- freepd: Free-public domain music used for the background. The track used for the project was "Martini Sunset". (The music can be found at: https://freepd.com/misc.php)

## Areas for Improvement
- [X] Animate the waiting page.
- [X] Include a tutorial or help section for new players.
- [X] Develop a mobile-responsive version of the game.
- [X] Implement a promise delay function to replace the timeout function in the server.
- [X] Implement an end animation that moves the card trick towards the winning player.
- [X] Fix a mismatch between the client's perception and the received game state when clicking a card too fast.
- [ ] Handle disconnects and allow the disconnecting player to return after a set period.
- [ ] Make the opponent's state private in the gamestate.
- [ ] Add a dark-mode feature.
- [ ] Implement a CPU opponent for single-player interaction.
- [ ] Improve the CSS of the end-game info card.
- [ ] Add a three-player, four-player mode (including the team variant of Bisca).
- [ ] Clean up code (in general)
