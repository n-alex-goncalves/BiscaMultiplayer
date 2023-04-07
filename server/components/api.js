const axios = require("axios");

const api = axios.create({
    baseURL: 'https://deckofcardsapi.com/api/deck/'
})

// Initialize Game State
const initializeGame = async (gameState) => {
    const deck = await createDeckID();
    const playerSockets = Object.keys(gameState.players);

    for (const socket of playerSockets) {
        gameState.players[socket].hand = await Draw(deck.deck_id, 3);
    }

    gameState.trumpCard = await Draw(deck.deck_id, 1);
    gameState.deckID = deck.deck_id;
  }

// Create an empty Game State and return Game State
const createGameState = (gameID) => {
    const gameState = { 
        gameID: gameID,
        deckID: null,
        players: {},
        remainingCards: 40,
        trumpCard: null,
        currentTrick: [null, null],
        currentTurn: 0,
        hasStarted: false
    }
    return gameState;
};

// Create an empty Player State and return Player State
const createPlayerState = () => {
    const playerState = { 
        name: null,
        hand: null,
        score: 0,
        isReady: false
    }
    return playerState;
};

// Create a Deck and return Deck
const createDeckID = async () => {
    const { data } = await api.get('new/shuffle/', {
        params: {
             // 8s, 9s and 10s removed
            cards: 'AS,2S,3S,4S,5S,6S,7S,JS,QS,KS,AD,2D,3D,4D,5D,6D,7D,JD,QD,KD,AC,2C,3C,4C,5C,6C,7C,JC,QC,KC,AH,2H,3H,4H,5H,6H,7H,JH,QH,KH',
            deck_count: 1
        }
    })
    return data;
};

// Draw (count) amount of cards from deck
const Draw = async (deck_id, count) => {
    const { data: cardResponse }  = await api.get(`${deck_id}/draw/`, {
        params: {
            count: count
        }
    })
    return cardResponse;
};

module.exports = { initializeGame, createGameState, createPlayerState, createDeckID, Draw }