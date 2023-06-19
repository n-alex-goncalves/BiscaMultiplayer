/*
import io from 'socket.io-client';

const hostname = window.location.hostname;
const port = process.env.PORT || 8000;
const socket = io.connect(`https://${hostname}`);

export default socket;
*/

// USE THE CODE BELOW IF YOU'RE USING NPM RUN START LOCALLY

import io from 'socket.io-client';

const hostname = window.location.hostname;
const port = process.env.PORT || 8000;
const socket = io.connect(`http://${hostname}:${port}`);

export default socket;