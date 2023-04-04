const axios = require("axios");

const api = axios.create({
    baseURL: 'https://deckofcardsapi.com/api/deck/'
})

// Create a Game State and return Game State
const createGameState = (gameID) => {
    const gameState = { 
        gameID: gameID,
        deckID: null,
        players: {},
        currentTrick: [],
        currentTurn: 0
    }
    return gameState;
};

const createPlayerState = () => {
    const playerState = { 
        name: null,
        hand: null,
        score: 0,
        isReady: false
    }
    return playerState;
};

// create a Deck and return Deck
const createDeckID = async () => {
    const { data } = await api.get('new/shuffle/', {
        params: {
             // 8s, 9s and 10s removed
            cards: 'AS,2S,3S,4S,5S,6S,7S,JS,QS,KS,AD,2D,3D,4D,5D,6D,7D,JD,QD,KD,AC,2C,3C,4C,5C,6C,7C,JC,QC,KC,AH,2H,3H,4H,5H,6H,7H,JH,QH,KH',
            deck_count: 1
        }
    })
    const { deck_id: deck_id } = data;
    return { deck_id };
};

// Draw a specified number of card from a deck
const Draw = async (deck_id, count) => {
    const { data: cardResponse }  = await api.get(`${deck_id}/draw/`, {
        params: {
            count: count
        }
    })
    return { cardResponse };
};

module.exports = { createGameState, createPlayerState, createDeckID, Draw }