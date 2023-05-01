import io from 'socket.io-client';

const hostname = window.location.hostname;
const port = process.env.PORT || 8000;
const socket = io.connect(`https://${hostname}:${port}`);

console.log(`https://${hostname}:${port}`);

export default socket;