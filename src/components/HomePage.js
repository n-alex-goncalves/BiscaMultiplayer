import React from 'react';
// import { io } from 'socket.io-client';

function createGame() {
  alert('create game!');
}

function joinGame() {
  alert('join game!');
}

const HomePage = () => {
    return (
      <>
      <label>
        PLAYER NAME <input name="playerName" />
      </label>
      <hr />
      <label>
        ROOM CODE <input name="roomCode" />
      </label>
      <hr />  
      <button onClick={createGame}>CREATE GAME</button>
      <hr />
      <button onClick={joinGame}>JOIN USING ROOM CODE</button>
      </>
    );
  };
  
export default HomePage;