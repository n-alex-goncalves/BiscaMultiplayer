// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// server = 8000
// client = 3000

// Requirements
// const cors               = require('cors');
const { createDeck, Draw }  = require('./api.js');
const express               = require('express');
const cors                  = require('cors');
const { v4: uuidv4 }        = require("uuid");

const port = 8000
const app = express()
app.use(cors())

const games = {};

// Create a new game
app.post("/createGame", (req, res) => {
  console.log('Create Game Requested')
  const gameID = uuidv4();
  const players = [req.body.player];
  const room = { id: gameID, players: players, gameState: null };
  games.push(room); 
  res.json({ gameID });
});

app.listen(port, function() {
  console.log(`Server is listening on port ${port}`);
});

/*
app.post("/joinGame", (req, res) => {
  const gameId = uuidv4();
  res.json({ gameId });
});

function createGame(gameId, playerId) {
  games[gameId] = {
    players: [playerId],
    currentPlayerIndex: 0
  };
}

function joinGame(gameId, playerId) {
  const game = games[gameId];
  if (!game) {
    throw new Error(`Game not found: ${gameId}`);
  }
  if (game.players.length >= 2) {
    throw new Error(`Game is full: ${gameId}`);
  }
  game.players.push(playerId);
}
*/

/*
// Get the game state for a specific game ID
app.get("/games/:id", (req, res) => {
  const gameId = req.params.id;
  const gameState = getGameState(gameId);
  res.json(gameState);
});

// Make a move in a specific game ID
app.post("/games/:id/moves", (req, res) => {
  const gameId = req.params.id;
  const move = req.body.move;
  makeMove(gameId, move);
  res.json({ success: true });
});

// Join a player to a specific game ID
app.post("/games/:id/players", (req, res) => {
  const gameId = req.params.id;
  const playerName = req.body.name;
  joinGame(gameId, playerName);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
*/

// https://www.youtube.com/watch?v=ppcBIHv_ZPs 

// follow this!

// join room with code
  // is room empty?
  // does room have one person?
  // is room full?
// disconnect room
  // is room empty?
  // does room have one person?
// create room
  // waiting page
  

/*
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/startGame', async (req, res) => {
  // player1Cards and player2Cards
  const fbDeck = await createDeck();
  const data = await Draw(fbDeck.deck_id, 3);
  res.send({  deck_id: fbDeck.deck_id, 
              cards: data.cardResponse.cards });
});
*/

/*
// Define an API endpoint that updates the game state in Firebase
app.post('/updateGameState', (req, res) => {
  const { player1hand, player2hand } = req.body; // Get the new game state from the request body

  // Update the game state in Firebase
  const db = firebaseAdmin.database();
  const tableRef = db.ref('table/table');
  const player1Ref = db.ref('player1Hand/player1Cards');
  const player2Ref = db.ref('player2Hand/player2Cards');

  tableRef.update({
    // Update the game table state
    trumpCard: trumpCard,
    deck: fbDeck,
    player1Card: null,
    player2Card: null
  });

  player1Ref.update({
    hand: player1hand
  });

  player2Ref.update({
    hand: player2hand
  });

  // send response back
  res.send('Game state updated successfully');
});

app.get('/getPlayerCards/:gameId', (req, res) => {
  const gameId = req.params.gameId;
  const gameData = snapshot.val();
  const player1Cards = gameData.player1Cards;
  res.send({ player1Cards: player1Cards });
});
*/

/*
  if player1 == req:
    const player1Cards = gameData.player1Cards;
    res.send({ player1Cards: player1Cards });
  else
    const player2Cards = gameData.player2Cards;
    res.send({ player2Cards: player2Cards });
*/


/*
// Import the functions you need from the SDKs you need

import { createDeck, Draw } from "./api";
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries
// https://mtyrervasell.medium.com/making-a-card-game-with-firebase-realtime-database-c214fdc62fcb
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBLnRq_BL1wEskw4-awuhd6wFm_DqKldys",
  authDomain: "bisca-multiplayer-game.firebaseapp.com",
  projectId: "bisca-multiplayer-game",
  storageBucket: "bisca-multiplayer-game.appspot.com",
  messagingSenderId: "506134446756",
  appId: "1:506134446756:web:9dfc23b96fe7754012dc31"
};

// Initialize Express
const express = require('express');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let DeckReference = firebase.database(); // initializes a reference to the firebase realtime database
let deckRef = DeckReference.ref('deckofCards'); // initializes a reference to the location in the database where the deck of cards will be stored

// set the deck to a new shuffled deck 
deckRef = await createDeck();

// set the hands and table to empty arrays to start
let player1Ref = DeckReference.ref('player1Hand');
let player2Ref = DeckReference.ref('player2Hand');
let tableRef = DeckReference.ref('table');

tableRef.set({table:[]})
player1Ref.set({player1Cards:[]});
player2Ref.set({player2Cards:[]});

deckRef.once('value', (snap) => {
  // get one time snapshot of the deck array
  let fbDeck = snap.val();

  // draw three cards for each player 
  let player1Cards = Draw(fbDeck, 3);
  let player2Cards = Draw(fbDeck, 3);

  // set three cards to player1Cards using firebase
  player1Ref.set({ player1Cards: player1Cards });
  player2Ref.set({ player2Cards: player2Cards });

  console.log(player1Cards);
  console.log(player2Cards);

  // set the new deck to the database (6 cards were removed)
  deckRef.set(fbDeck);
});

/*
  // deal to alternate players
  let turn = true;
  if (turn) {
   // push the new card into player 1's database hand
    player1Ref.push().set(fbCard);
    turn = false;
  } else {
    // push the new card into player 1's database hand
    player2Ref.push().set(fbCard);
    turn = true;   
  }
*/