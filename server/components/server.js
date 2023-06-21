const { initializeGame, createGameState, createPlayerState, calculateTrickPoints, Draw, Return } = require('./api.js');
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

const server = http.createServer(app);

/*
const io = require('socket.io')(server, { 
  cors: { 
    origin: ["*", "*:*", "https://bisca-multiplayer.onrender.com", "https://bisca-multiplayer.onrender.com:*", 'https://bisca-multiplayer.onrender.com:8000']
  }
});
*/

const io = require('socket.io')(server, { 
  cors: { origin: "*" }
});

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

  // Event handler for when a card is selected
  socket.on("onCardSelected", async (data) => {
    const { card, index, gameID } = data;
    
    const gameState = games[gameID];
    const boardState = gameState.board;
    const deckID = gameState.board.deckID;
    const currentTurnIndex = gameState.currentTurnIndex;
    const socketPlayerIndex = gameState.turnOrder.indexOf(socket.id);

    if (socketPlayerIndex !== gameState.currentTurnIndex || gameState.board.currentTrick.every((card) => card !== null)) {
      console.error('ERROR NOT PLAYER TURN')
      return;
    }
    
    const newHand = [ ...gameState.players[socket.id].hand ];
    newHand[index] = null;

    const newPlayers = { ...gameState.players };
    newPlayers[socket.id] = { ...newPlayers[socket.id], hand: newHand };

    const newTrick = [...gameState.board.currentTrick];
    newTrick[newTrick.findIndex((element) => element === null)] = { ...card, index };

    let newTrumpCard = gameState.board.trumpCard;
    let newRemainingCards = gameState.board.remainingCards;
    let newTurnIndex = (newTrick.every((card) => card !== null)) ? currentTurnIndex : (currentTurnIndex + 1) % Object.keys(gameState.players).length;

    const ongoingBoardState = {
      ...boardState,
      trumpCard: newTrumpCard,
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
      const delay = (ms) => {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      };

      const updateGameState = async () => {
        const trumpCard = newTrumpCard;
        const { winnerID, points } = calculateTrickPoints(newTrick, trumpCard.suit);
        
        newPlayers[winnerID] = {
          ...newPlayers[winnerID],
          score: newPlayers[winnerID].score + points,
          cardsWon: newPlayers[winnerID].cardsWon.concat(newTrick)
        };
      
        const winnerIndex = Object.entries(newPlayers).findIndex(([playerID]) => playerID === winnerID);
        const playersArray = Object.entries(newPlayers);
        const reorderedPlayers = playersArray.slice(winnerIndex).concat(playersArray.slice(0, winnerIndex));
        let nullIndex;

        // For each player, draw a new card
        for (const [playerID, newPlayer] of reorderedPlayers) {
          nullIndex = newPlayer.hand.findIndex(card => card === null);
          if (newRemainingCards === 0 && newTrumpCard?.isVisible === true) {
            await Return(deckID, [newTrumpCard.code]);
            newTrumpCard.isVisible = false;
          }
          if (nullIndex !== -1) {
            const response = await Draw(deckID, 1, playerID);    
            newRemainingCards = response.remaining;
            newPlayer.hand[nullIndex] = response.cards[0];
          }
        }
      
        newTurnIndex = gameState.turnOrder.indexOf(winnerID);
        
        io.to(gameID).emit('getGameStateResponse', { gameState: { ...ongoingGameState, currentTurnIndex: newTurnIndex }, success: true });
  
        newTrick.fill(null);

        const completeBoardState = {
          ...ongoingBoardState,
          trumpCard: newTrumpCard,
          remainingCards: newRemainingCards,
          currentTrick: newTrick
        };
        
        const completeGameState = {
          ...ongoingGameState,
          board: completeBoardState,
          players: newPlayers,
          currentTurnIndex: newTurnIndex
        };
        
        games[gameID] = completeGameState;
        io.to(gameID).emit('getGameStateResponse', { gameState: completeGameState, success: true });
        
        if (Object.values(completeGameState.players).every(player => player.hand?.every(card => card == null))) {
          io.to(gameID).emit('getWinningStateResponse', { gameState: completeGameState, winner: socket.id, success: true });
          return;
        }
      };      
 
      await delay(1500);
      await updateGameState();
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