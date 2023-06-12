const { initializeGame, createGameState, createPlayerState, Draw, Return, calculateTrickPoints } = require('./api.js');
const express = require('express');
const cors = require('cors');
const http = require('http');
const crypto = require("crypto");
const path = require('path');
const bodyParser = require('body-parser');

const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define a route that serves mp3 file
app.get('/background-music.mp3', (req, res) => {
  const filePath = path.resolve(__dirname, '../audio/background-music.mp3');
  res.setHeader('Content-Type', 'audio/mpeg');
  res.sendFile(filePath);
});

// Define a route that serves mp3 file
app.get('/placeholder.png', (req, res) => {
  const filePath = path.resolve(__dirname, '../audio/placeholder.png');
  res.setHeader('Content-Type', 'image/png');
  res.sendFile(filePath);
});

const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*', }, });

const games = {};
const socketToGameMap = {};

// Event handler for new socket connection
io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  // Event handler for creating a game room
  socket.on("createGameRoom", () => {
    const gameID = crypto.randomBytes(3).toString('hex');
    const gameState = createGameState(gameID);

    gameState.players[socket.id] = createPlayerState(socket.id);
    socketToGameMap[socket.id] = gameID;
    games[gameID] = gameState;
    socket.join(gameID);
    
    socket.emit("createRoomResponse", { gameID: gameID, success: true });
  });

  // Event handler for joining a game room
  socket.on("joinGameRoom", (data) => {
    const gameID = data.gameID;
    const gameState = games[gameID];

    if (!gameID || !gameState) {
      socket.emit("joinRoomResponse", { error: "Game does not exist." });
      return;
    }

    gameState.players[socket.id] = createPlayerState(socket.id);
    socketToGameMap[socket.id] = gameID;
    
    if (!socket.rooms.has(gameID)) {
      socket.join(gameID);
    }

    socket.emit("joinRoomResponse", { gameID: gameID, success: true });
  });

  // Event handler for when a player has joined a room and is ready
  socket.on("onPlayerReady", async (data) => {
    const gameID = socketToGameMap[socket.id];
    const gameState = games[gameID];
    const playerState = games[gameID]?.players[socket.id];
    
    if (!gameID || !gameState || !playerState) {
      console.error(`Error: Invalid gameID ${gameID} or player ${socket.id}`);
      return;
    }
  
    playerState.name = data.name;
    playerState.isReady = true;
    const numReadyPlayers = Object.values(gameState.players).filter(playerState => playerState.isReady).length;
    
    if (numReadyPlayers === 2 && !gameState.hasStarted) {
      gameState.hasStarted = true;
      await initializeGame(gameState);
      io.to(gameID).emit('startGameSession', { success: true });
    }
  });

  // Event handler for when a game has reached an end state
  socket.on("gameEnd", (data) => {
    const gameID = socketToGameMap[socket.id];
    const gameState = games[gameID];
    const playerState = games[gameID]?.players[socket.id];

    playerState.isReady = false;
    gameState.hasStarted = false;
  });

  // Event handler for getting the game state
  socket.on("getGameState", (data) => {
    const gameID = data.gameID;
    const gameState = games[gameID];

    if (!gameID || !gameState) {
      console.error(`Error: Invalid gameID ${gameID} or player ${socket.id}`);
      return;
    }

    socket.emit("getGameStateResponse", { gameState: gameState, success: true });
  });

  // Evnet handler for when a card is selected
  socket.on("onCardSelected", async (data) => {
    const { card, index, gameID } = data;
    const gameState = games[gameID];
    const boardState = gameState.board;

    const deckID = gameState.board.deckID;
    const currentTurnIndex = gameState.currentTurnIndex;
    const socketPlayerIndex = gameState.turnOrder.indexOf(socket.id);

    if (socketPlayerIndex !== gameState.currentTurnIndex || gameState.board.currentTrick.every((card) => card !== null)) {
      console.log('ERROR NOT PLAYER TURN')
      return;
    }
    
    const newHand = [ ...gameState.players[socket.id].hand ];
    newHand[index] = null;

    const newPlayers = { ...gameState.players };
    newPlayers[socket.id] = { ...newPlayers[socket.id], hand: newHand };

    const newTrick = [...gameState.board.currentTrick];
    newTrick[currentTurnIndex] = { ...card, index: index };

    let newTrumpCard = gameState.board.trumpCard;
    let newTemporaryTrumpCard = gameState.board.temporaryTrumpCard;
    let newRemainingCards = gameState.board.remainingCards;
    let newTurnIndex = (gameState.currentTurnIndex + 1) % Object.keys(gameState.players).length;

    if (newTrick.every((card) => card !== null)) {
      newTurnIndex = (gameState.currentTurnIndex) % Object.keys(gameState.players).length; 

      setTimeout(async () => {
        const trumpCard = newTemporaryTrumpCard || newTrumpCard;
        const { winnerID, points } = calculateTrickPoints(newTrick, trumpCard.suit);

        newPlayers[winnerID] = { ...newPlayers[winnerID], score: newPlayers[winnerID].score + points, cardsWon: newPlayers[winnerID].cardsWon.concat(newTrick) };

        const winnerIndex = Object.entries(newPlayers).findIndex(([playerID]) => playerID === winnerID);
        const playersArray = Object.entries(newPlayers);
        const reorderedPlayers = playersArray.slice(winnerIndex).concat(playersArray.slice(0, winnerIndex));
        
        for (const [playerID, newPlayer] of reorderedPlayers) {

          const nullIndex = newPlayer.hand.findIndex(card => card === null);

          if (newRemainingCards == 0 && newTrumpCard !== null) {
            await Return(deckID, [newTrumpCard.code]);
            newTemporaryTrumpCard = newTrumpCard;
            newTrumpCard = null;
          }

          if (nullIndex !== -1) {
            const response = await Draw(deckID, 1, playerID);    

            newRemainingCards = response.remaining;

            newPlayer.hand[nullIndex] = response.cards[0];
          }
        }

        newTrick.fill(null);

        newTurnIndex = gameState.turnOrder.indexOf(winnerID);
        
        const newBoardState = {
          ...boardState,
          trumpCard: newTrumpCard,
          temporaryTrumpCard: newTemporaryTrumpCard,
          remainingCards: newRemainingCards,
          currentTrick: newTrick
        }

        const newGameState = {
          ...gameState,
          board: newBoardState,
          players: newPlayers,
          currentTurnIndex: newTurnIndex
        }
    
        games[gameID] = newGameState;
    
        io.to(gameID).emit('getGameStateResponse', { gameState: newGameState, success: true });

        const players = Object.values(newGameState.players);
        if (players.every(player => player.hand?.every(card => card == null))) {
          io.to(gameID).emit('getWinningStateResponse', { gameState: gameState, winner: socket.id, success: true });
          return;
        }
      }, 2000);
    }

    const newBoardState = {
      ...boardState,
      trumpCard: newTrumpCard,
      temporaryTrumpCard: newTemporaryTrumpCard,
      remainingCards: newRemainingCards,
      currentTrick: newTrick
    }

    const newGameState = {
      ...gameState,
      board: newBoardState,
      players: newPlayers,
      currentTurnIndex: newTurnIndex
    }

    games[gameID] = newGameState;
    
    io.to(gameID).emit('getGameStateResponse', { gameState: newGameState, success: true });
  });

  // Event handler for when a socket disconnects
  socket.on('disconnect', () => {
    const gameID = socketToGameMap[socket.id];
    const gameState = games[gameID];

    if (gameID) {
      delete games[gameID].players[socket.id]
      if (Object.keys(gameState.players).length == 0) {
        delete games[gameID]
      }
      delete socketToGameMap[socket.id];
    }

    console.log(`Socket ${socket.id} disconnected.`);
  });
});


const port = process.env.PORT || 8000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});