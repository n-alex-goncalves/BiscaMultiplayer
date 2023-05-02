const { initializeGame, createGameState, createPlayerState, Draw, Return, calculateTrickPoints }       = require('./api.js');
const express                                                                                          = require('express');
const bodyParser                                                                                       = require('body-parser');
const cors                                                                                             = require('cors');
const http                                                                                             = require('http');
const crypto                                                                                           = require("crypto");
const path                                                                                             = require('path');

// express routing and socket.io, how do I do that?
const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: ['*', 'https://bisca-multiplayer.onrender.com', 'https://bisca-multiplayer.onrender.com:*', 'https://bisca-multiplayer.onrender.com:8000']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

app.use(express.static('build', { 
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use('/static/js', express.static(path.join(__dirname, '../build/static/js'), {
  setHeaders: function (res, path) {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Define a route that serves mp3 file
app.get('/background-music.mp3', (req, res) => {
  const filePath = path.resolve(__dirname, 'background-music.mp3');
  res.setHeader('Content-Type', 'audio/mpeg');
  res.sendFile(filePath);
});

// Define a route that serves the index.html file
//__dirname : It will resolve to your project folder
app.get('/*', function(req, res) {
  console.log('RECEIVE INDEX.HTML')
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

// Catch-all route that serves the index.html file for any other routes
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

const io = require('socket.io')(server, { 
  cors: { 
    origin: ['*', 'https://bisca-multiplayer.onrender.com', 'https://bisca-multiplayer.onrender.com:*', 'https://bisca-multiplayer.onrender.com:8000'], 
    methods: ["GET", "POST"],
  }
});

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


/**
const games = {};
const socketToGameMap = {};

io.on('connection', (socket) => {

  console.log(`Socket ${socket.id} connected.`);
  
  // ======================

  // Create a new game room
  socket.on("createGameRoom", () => {
    const gameID = crypto.randomBytes(3).toString('hex');
    const gameState = createGameState(gameID);

    // Store the room in the games dictionary and map the socket ID to the corresponding game ID and player name
    gameState.players[socket.id] = createPlayerState(socket.id);
    socketToGameMap[socket.id] = gameID;
    games[gameID] = gameState;

    // Add the socket to the room with roomID
    socket.join(gameID);
    
    // Emit response to client
    socket.emit("createRoomResponse", { gameID: gameID, success: true });
  });

  // ======================

  // Join an existing game room
  socket.on("joinGameRoom", (data) => {
    const gameID = data.gameID;
    const gameState = games[gameID];

    // Check if gameID and gameState exist
    if (!gameID || !gameState) {
      socket.emit("joinRoomResponse", { error: "Game does not exist." });
      return;
    }
    // Store the player's name in the games dictionary and map the socket ID to the corresponding game ID
    gameState.players[socket.id] = createPlayerState(socket.id);
    socketToGameMap[socket.id] = gameID;
    
    // Add the socket to the room with roomID and emit response to client
    if (!socket.rooms.has(gameID)) {
      socket.join(gameID);
    }
    socket.emit("joinRoomResponse", { gameID: gameID, success: true });
  });

  // ======================

  // Check if client is ready
  socket.on("onPlayerReady", async (data) => {
    const gameID = socketToGameMap[socket.id];
    const gameState = games[gameID];
    const playerState = games[gameID]?.players[socket.id];
    
    // Check if gameID and player exists
    if (!gameID || !gameState || !playerState) {
      console.error(`Error: Invalid gameID ${gameID} or player ${socket.id}`);
      return;
    }
    
    // Set new values to the player when they're ready
    playerState.name = data.name;
    playerState.isReady = true;

    const numReadyPlayers = Object.values(gameState.players).filter(playerState => playerState.isReady).length;
    
    // Initialize the game and send each client to the gameBoard if both are ready.
    if (numReadyPlayers === 2 && !gameState.hasStarted) {
      gameState.hasStarted = true;
      await initializeGame(gameState);
      io.to(gameID).emit('startGameSession', { success: true });
    }
  });

  // Get gameState
  socket.on("gameEnd", (data) => {
    const gameID = socketToGameMap[socket.id];
    const gameState = games[gameID];
    const playerState = games[gameID]?.players[socket.id];

    playerState.isReady = false;
    gameState.hasStarted = false;

    console.log('--------> Game Ended', socket.id);
  });

  // ======================

  // Get gameState
  socket.on("getGameState", (data) => {
    const gameID = data.gameID;
    const gameState = games[gameID];

    // Check if gameID and player exists
    if (!gameID || !gameState) {
      console.error(`Error: Invalid gameID ${gameID} or player ${socket.id}`);
      return;
    }

    socket.emit("getGameStateResponse", { gameState: gameState, success: true });
  });

  // ======================

  // When card is selected by user
  socket.on("onCardSelected", async (data) => {
    const { card, index, gameID } = data;
    const gameState = games[gameID];
    const boardState = gameState.board;
    const deckID = gameState.board.deckID;

    // Turn index
    const currentTurnIndex = gameState.currentTurnIndex;
    const currentPlayerIndex = gameState.turnOrder.indexOf(socket.id);

    // Check if it's player's turn or if card trick is full
    if (currentPlayerIndex !== gameState.currentTurnIndex || gameState.board.currentTrick.every((card) => card !== null)) {
      console.log('ERROR NOT PLAYER TURN')
      return;
    }
    
    // Assign intermediate variables
    const newHand = [ ...gameState.players[socket.id].hand ];
    newHand[index] = null;

    const newPlayers = { ...gameState.players };
    newPlayers[socket.id] = { ...newPlayers[socket.id], hand: newHand };

    const newTrick = [...gameState.board.currentTrick];
    newTrick[currentTurnIndex] = { ...card, index: index };

    // Assign reassignable values for later use
    let newTrumpCard = gameState.board.trumpCard;
    let newTemporaryTrumpCard = gameState.board.temporaryTrumpCard;
    let newRemainingCards = gameState.board.remainingCards;
    let newTurnIndex = (gameState.currentTurnIndex + 1) % Object.keys(gameState.players).length;

    // If the card trick is full
    if (newTrick.every((card) => card !== null)) {
      newTurnIndex = (gameState.currentTurnIndex) % Object.keys(gameState.players).length; 

      setTimeout(async () => {
        // Calculate trick points
        const trumpCard = newTemporaryTrumpCard || newTrumpCard;
        const { winnerID, points } = calculateTrickPoints(newTrick, trumpCard.suit);

        // Update score
        newPlayers[winnerID] = { ...newPlayers[winnerID], score: newPlayers[winnerID].score + points, cardsWon: newPlayers[winnerID].cardsWon.concat(newTrick) };

        // Find the index of the winner in the Object.entries array
        const winnerIndex = Object.entries(newPlayers).findIndex(([playerID]) => playerID === winnerID);

        // Slice the array to start from the winnerIndex and concatenate it with the beginning part of the array
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
            // Draw a new card
            const response = await Draw(deckID, 1, playerID);    

            // Update remaining cards count in gameState
            newRemainingCards = response.remaining;

            // Set null empty index to new card drawn
            newPlayer.hand[nullIndex] = response.cards[0];
          }
        }

        // Reset the trick to an empty array
        newTrick.fill(null);

        // Winner begins next round
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
    
        // Update the games object with the new game state
        games[gameID] = newGameState;
    
        // Emit the updated game state to all clients in the game room
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

    // Update the games object with the new game state
    games[gameID] = newGameState;
    
    // Emit the updated game state to all clients in the game room
    io.to(gameID).emit('getGameStateResponse', { gameState: newGameState, success: true });
  });


  // ======================

  // Get the game state for a specific game ID
  socket.on('disconnect', () => {
    const gameID = socketToGameMap[socket.id];
    const gameState = games[gameID];

    if (gameID) {
      // Remove the corresponding playerName from the game
      delete games[gameID].players[socket.id]
    
      // Check if both players are disconnected from the room and delete the game if true
      if (Object.keys(gameState.players).length == 0) {
        delete games[gameID]
      }

      // Remove the socket from socketToGameMap and socketToNameMap
      delete socketToGameMap[socket.id];
    }
    console.log(`Socket ${socket.id} disconnected.`);
  });

});
**/