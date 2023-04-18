const axios = require("axios");

const api = axios.create({
    baseURL: 'https://deckofcardsapi.com/api/deck/'
})

// Initialize Game State
const initializeGame = async (gameState) => {
    const deck = await createDeckID();
    const deckID = deck.deck_id;
    const playerSockets = Object.keys(gameState.players);

    for (const socket of playerSockets) {
        const response = await Draw(deckID, 3, socket);
        gameState.board.remainingCards = response.remaining;
        gameState.players[socket].hand = response.cards;
    }

    const trumpCard = await Draw(deckID, 1);
    gameState.board.deckID = deckID;
    gameState.board.trumpCard = trumpCard.cards[0];
    gameState.turnOrder = playerSockets;
  }


// Create an empty Game State and return Game State
const createGameState = (gameID) => {
    const MAX_CARDS = 40;
    return {
        gameID,
        hasStarted: false,
        board: { 
            deckID: null,
            trumpCard: null,
            temporaryTrumpCard: null,
            remainingCards: MAX_CARDS,
            currentTrick: [null, null]
            // other board-related properties
        },
        currentTurnIndex: 0,
        turnOrder: [],
        players: {}
    };
};

// Create an empty Player State and return Player State
const createPlayerState = (socketID) => {
    return { 
        socketID,
        name: null,
        hand: null,
        score: 0,
        isReady: false
    }

};

// Create a Deck and return Deck
const createDeckID = async () => {
    /*
    const cards = [
        'AS', '2S',
        'AD', '2D',
        'AC', '2C',
        'AH', '2H'
    ];
    */
    const cards = [
        'AS', '2S', '3S', '4S', '5S', '6S', '7S', 'JS', 'QS', 'KS',
        'AD', '2D', '3D', '4D', '5D', '6D', '7D', 'JD', 'QD', 'KD',
        'AC', '2C', '3C', '4C', '5C', '6C', '7C', 'JC', 'QC', 'KC',
        'AH', '2H', '3H', '4H', '5H', '6H', '7H', 'JH', 'QH', 'KH'
    ];
    const { data } = await api.get('new/shuffle/', {
        params: {
            cards: cards.join(','),
            deck_count: 1
        }
    })
    return data;
};

// Draw (count) number of cards from deck
const Draw = async (deckID, count, socketID = null) => {
    const { data: response }  = await api.get(`${deckID}/draw/`, {
        params: {
            count: count
        }
    })

    for (const card of response.cards) {
        card.cardOwnership = socketID;
    }
    
    return response;
};

// Return (array) cards to deck
const Return = async (deckID, cards) => {
    const { data: response }  = await api.get(`${deckID}/return/`, {
        params: {
            cards: cards.join(',')
        }
    })

    return response;
};

// Calculate the winner and number of points of a trick
const calculateTrickPoints = (cards, trumpSuit) => {
    let winningCard = cards[0];
    let total = getValue(cards[0]);
    // Iterate through cards (trick)
    for (let i = 1; i < cards.length; i++) {
        const currentCard = cards[i];
        // If both cards are the same suit
        if (currentCard.suit === winningCard.suit) {
            if (getValue(currentCard) > getValue(winningCard)) {
                winningCard = currentCard;
            }
        } else if (currentCard.suit === trumpSuit) {
            // If currentCard is the same suit as the trumpCard
            winningCard = currentCard;
        } else if (winningCard.suit !== trumpSuit) {
            // If neither card is trump and they are of different suits, compare by suit/value of first card played
            if (currentCard.suit === cards[0].suit && getValue(currentCard) > getValue(winningCard)) {
                winningCard = currentCard;
            }   
        }
        total += getValue(currentCard);
    }
    return { winnerID: winningCard.cardOwnership, points: total };
  };
  
// Retrieve the bisca value of card based on its original value
const getValue = (card) => {
    switch (card.value) {
        case "ACE":
            return 11;
        case "KING":
            return 4;
        case "JACK":
            return 3;
        case "QUEEN":
            return 2;
        case "7": // Bisca
            return 10;
        default: // Palha
            return 0;
    }
};

module.exports = { initializeGame, createGameState, createPlayerState, Draw, Return, calculateTrickPoints }