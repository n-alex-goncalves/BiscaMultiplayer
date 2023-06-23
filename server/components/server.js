const { initializeGame, createGameState, createPlayerState, calculateTrickPoints, Draw, Return, updateGameState } = require('./api.js');
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

const server = http.createServer(app);

const io = require('socket.io')(server, { 
  cors: { origin: "*" }
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

app.use(express.static('build', { 
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Define a route that serves static JS files
app.use('/static/js', express.static(path.join(__dirname, '../build/static/js'), {
  setHeaders: function (res, path) {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

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

// Define a route that serves the index.html file
//__dirname : It will resolve to your project folder
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

// Catch-all route that serves the index.html file for any other routes
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

// Delays code by a specificed amount (in miliseconds)
const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

// Sends two updates of game state to each client; an ongoing game state (for animation) and then the final complete game state
const sendUpdate = async (gameID, deckID, gameState, ongoingGameState, ongoingBoardState) => {
  const { completeGameState, winnerID } = await updateGameState(gameID, deckID, ongoingGameState, ongoingBoardState);
  games[gameID] = { ...completeGameState, currentTurnIndex: gameState.turnOrder.indexOf(winnerID) };

  io.to(gameID).emit('getGameStateResponse', { gameState: { ...ongoingGameState,  currentTurnIndex: gameState.turnOrder.indexOf(winnerID) }, success: true });        
  io.to(gameID).emit('getGameStateResponse', { gameState: { ...completeGameState, currentTurnIndex: gameState.turnOrder.indexOf(winnerID) }, success: true });

  // Check if all players have empty hands and emit event for winning state if applicable
  if (Object.values(completeGameState.players).every(player => player.hand?.every(card => card == null))) {
    io.to(gameID).emit('getWinningStateResponse', { gameState: { ...completeGameState, currentTurnIndex: gameState.turnOrder.indexOf(winnerID) }, success: true });
  };
}

const games = {};
const socketToGameMap = {};

// IO handler for new socket connection
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

  // Event handler for when a client selects a card
  socket.on("onCardSelected", async (data) => {
    const { card, index, gameID } = data;
    
    const gameState = games[gameID];
    const boardState = gameState.board;
    const deckID = boardState.deckID;
    const currentTurnIndex = gameState.currentTurnIndex;
    const socketPlayerIndex = gameState.turnOrder.indexOf(socket.id);

    if (socketPlayerIndex !== gameState.currentTurnIndex || boardState.currentTrick.every((card) => card !== null)) {
      console.error('ERROR NOT PLAYER TURN')
      return;
    }
    
    const newHand = [ ...gameState.players[socket.id].hand ];
    newHand[index] = null;

    const newPlayers = { ...gameState.players };
    newPlayers[socket.id] = { ...newPlayers[socket.id], hand: newHand };

    const newTrick = [...boardState.currentTrick];
    newTrick[newTrick.findIndex((element) => element === null)] = { ...card, index };

    const trumpCard = boardState.trumpCard;
    const newRemainingCards = boardState.remainingCards;
    const newTurnIndex = (newTrick.every((card) => card !== null)) ? currentTurnIndex : (currentTurnIndex + 1) % Object.keys(gameState.players).length;

    const ongoingBoardState = {
      deckID: deckID,
      trumpCard: trumpCard,
      remainingCards: newRemainingCards,
      currentTrick: newTrick
    }

    const ongoingGameState = {
      ...gameState,
      board: ongoingBoardState,
      players: newPlayers,
      currentTurnIndex: newTurnIndex
    }
    
    games[gameID] = ongoingGameState;
    io.to(gameID).emit('getGameStateResponse', { gameState: ongoingGameState, success: true });

    if (newTrick.every((card) => card !== null)) {      
      await delay(1500);
      await sendUpdate(gameID, deckID, gameState, ongoingGameState, ongoingBoardState);
    }
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