import io from 'socket.io-client';

const hostname = window.location.hostname;
const port = process.env.PORT || 8000;

//const socket = io.connect(`http://${hostname}:${port}`);
const socket = io.connect(`https://${hostname}`);

export default socket;
