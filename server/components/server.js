// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Requirements
const { initializeGame, createGameState, createPlayerState, createDeckID, Draw, calculateTrickPoints } = require('./api.js');
const express                                                                                          = require('express');
const bodyParser                                                                                       = require('body-parser');
const cors                                                                                             = require('cors');
const http                                                                                             = require('http');
const crypto                                                                                           = require("node:crypto");

const port = 8000
const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*', }, });

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
    games[gameID] = gameState;
    games[gameID].players[socket.id] = createPlayerState();
    socketToGameMap[socket.id] = gameID;

    // Add the socket to the room with roomID
    socket.join(gameID);
    
    // Emit response to client
    socket.emit("createRoomResponse", { gameID: gameID, success: true });
  });

  // ======================

  // Join an existing game room
  socket.on("joinGameRoom", (data) => {
    const gameID = data.gameID

    if (!gameID || !games[gameID]) {
      socket.emit("joinRoomResponse", { error: "Game does not exist." });
      return;
    }

    // Store the player's name in the games dictionary and map the socket ID to the corresponding game ID
    games[gameID].players[socket.id] = createPlayerState();
    socketToGameMap[socket.id] = gameID;
    
    // Add the socket to the room with roomID and emit response to client
    socket.join(gameID);
    socket.emit("joinRoomResponse", { gameID: gameID, success: true });
  });

  // ======================

  // Check if client is ready
  socket.on("onPlayerReady", async (data) => {
    const gameID = socketToGameMap[socket.id];
    const gameState = games[gameID];
    const playerState = games[gameID]?.players[socket.id];
    
    // Check if gameID and player exists
    if (!gameID || !playerState) {
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

  // ======================

  // Get gameState
  socket.on("getGameState", (data) => {
    const gameID = data.gameID
    const gameState = games[gameID]

    // Check if gameID and player exists
    if (!gameID) {
      console.error(`Error: Invalid gameID ${gameID} or player ${socket.id}`);
      return;
    }

    socket.emit("getGameStateResponse", { gameState: gameState, success: true });
  });

  // ======================

  socket.on("onCardSelected", async (data) => {
    const { card, index, gameID } = data;
    const gameState = games[gameID];
    const deckID = gameState.deckID;

    const currentTurnIndex = gameState.currentTurnIndex;
    const currentPlayerIndex = gameState.turnOrder.indexOf(socket.id);

    if (currentPlayerIndex !== gameState.currentTurnIndex) {
      console.log("PLAYER_NOT_TURN_ERROR");
      return;
    }

    // Assign intermediate variables
    const newTrick = [...gameState.currentTrick];
    newTrick[currentTurnIndex] = card;

    const newHand = { ...gameState.players[socket.id].hand };
    newHand.cards[index] = undefined;
    
    const newPlayers = { ...gameState.players };
    newPlayers[socket.id] = { ...newPlayers[socket.id], hand: newHand };

    let newTurnIndex = (gameState.currentTurnIndex + 1) % Object.keys(games[gameID].players).length;

    // If the card trick is full
    if (newTrick.every((card) => card !== null)) {
      setTimeout(async () => {
        // Calculate trick points
        const { winnerID, points } = calculateTrickPoints(newTrick, gameState.trumpCard.cards[0].suit);

        // Reset the trick to an empty array
        newTrick.fill(null);

        // Update score
        newPlayers[winnerID] = { ...newPlayers[winnerID], score: newPlayers[winnerID].score + points };

        // Draw a new card for each player
        for (const [playerID, newPlayer] of Object.entries(newPlayers)) {
          const undefinedCardIndex = newPlayer.hand.cards.findIndex(card => card === undefined);
          if (undefinedCardIndex !== -1) {
            const cardResponse = await Draw(deckID, 1, playerID);
            newPlayer.hand.cards[undefinedCardIndex] = cardResponse.cards[0];
          }
        }

        // Winner begins next round
        newTurnIndex = gameState.turnOrder.indexOf(winnerID);

        const newGameState = {
          ...gameState,
          currentTrick: newTrick,
          players: newPlayers,
          currentTurnIndex: newTurnIndex
        }
    
        // Update the games object with the new game state
        games[gameID] = newGameState;
    
        // Emit the updated game state to all clients in the game room
        io.to(gameID).emit('getGameStateResponse', { gameState: newGameState, success: true });
        
      }, 2000); // Delay the execution by 2 seconds
    }
  
    const newGameState = {
      ...gameState,
      currentTrick: newTrick,
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
    if (gameID) {
      // Remove the corresponding playerName from the game
      delete games[gameID].players[socket.id]
    
      // Check if both players are disconnected from the room and delete the game if true
      if (Object.keys(games[gameID].players).length == 0) {
        delete games[gameID]
      }

      // Remove the socket from socketToGameMap and socketToNameMap
      delete socketToGameMap[socket.id];
    }
    console.log(`Socket ${socket.id} disconnected.`);
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});