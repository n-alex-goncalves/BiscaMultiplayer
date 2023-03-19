const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(3001, () => {
  console.log('Server is running on port 3000');
});

/*
const io = require('socket.io')(3000, {
    cors: {
        origin: ["http://localhost:8080"], // client
    },
})

class CGameState
{
    public:
        // Setup and destroy the state
        void Init();
        void Cleanup();

        // Used when temporarily transitioning to another state
        void Pause();
        void Resume();

        // The three important actions within a game loop
        void HandleEvents();
        void Update();
        void Draw();
};

/ https://mtyrervasell.medium.com/making-a-card-game-with-firebase-realtime-database-c214fdc62fcb

/ A way to keep track of the game state


/ socket.io

/ encryption

/ handle game logc

/ player disconnect


/ 


io.on("connection", socket => {
    console.log(socket.id, 'test')
    socket.on('custom-event', (number, string, obj) => { // custom-event for when a client sends custom-event
        console.log(number, string, obj)
    })
  
    socket.on('play-card', (card, room) => {
        socket.to(room).emit('receive-card', card)
    })
    socket.on('join-room', room => {
        socket.join(room)
    })


    


*/

