const io = require('socket.io')(3000, {
    cors: {
        origin: ["http://localhost:8080"], // client
    },
})

// a function that runs everytime a client connects to the server
io.on("connection", socket => {
    console.log(socket.id, 'test')
    socket.on('custom-event', (number, string, obj) => { // custom-event for when a client sends custom-event
        console.log(number, string, obj)
    })
    /*
    socket.on('play-card', (card, room) => {
        socket.to(room).emit('receive-card', card)
    })
    socket.on('join-room', room => {
        socket.join(room)
    })
    */
})