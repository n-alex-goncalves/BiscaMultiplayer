import { Deck, Hand } from "./deck.js"
import { io } from "socket.io-client"

const socket = io('http://localhost:3000')

// send something to the server
socket.emit('custom-event', 10, 'Hi', {a: 'a'})

// socket.emit('play-card', card)
// socket.on('receive-card', card)

/*
connect-to-server = socket.emit('connect-to-server')

clientId
*/

/*
create-game = socket.emit('create-game', clientId)

all cards, gameId
*/

/*
join-game = socket.emit('join-game', clientId, gameId)

game state, all clients (the other player)
only two clients
*/

/*
play-card = socket.emit('play-card', clientId, gameId, card)

*/

/*
broadcast-state = socket.on('broadcast-state', clientId, gameId, card)











*/

const CARD_VALUE_MAP = {
    "A": 11,
    "7": 10,
    "K": 4,
    "J": 3,
    "Q": 2,
    "6": 0,
    "5": 0,
    "4": 0,
    "3": 0,
    "2": 0,
}

const biscaDeckElement = document.querySelector('.computer-deck')

const computerPointsElement = document.querySelector('.computer-points')
const playerPointsElement = document.querySelector('.player-points')

const trumpCardSlot = document.querySelector('.slot4')
const playedCard1Element = document.querySelector('.slot5')
const playedCard2Element = document.querySelector('.slot6')

const computerCardSlot1 = document.querySelector('.slot1')
const computerCardSlot2 = document.querySelector('.slot2')
const computerCardSlot3 = document.querySelector('.slot3')

const playerCardSlot1 = document.querySelector('.slot7')
const playerCardSlot2 = document.querySelector('.slot8')
const playerCardSlot3 = document.querySelector('.slot9')

const computerCardSlots = [computerCardSlot1, computerCardSlot2, computerCardSlot3]
const playerCardSlots = [playerCardSlot1, playerCardSlot2, playerCardSlot3]

let biscaDeck, trumpCard, playedCard
let [playerHand, computerHand] = [new Hand('player'), new Hand('computer')]
let playerTurn = true
let scoreboard = {'player': 0, 'computer': 0}
let table = []

playerCardSlot1.addEventListener("click", function() { if (playerTurn) { playerCardSlot1.innerHTML = ''; addToTablePlayer(1) }})
playerCardSlot2.addEventListener("click", function() { if (playerTurn) { playerCardSlot2.innerHTML = ''; addToTablePlayer(2) }})
playerCardSlot3.addEventListener("click", function() { if (playerTurn) { playerCardSlot3.innerHTML = ''; addToTablePlayer(3) }})

computerCardSlot1.addEventListener("click", function() { if (!playerTurn) { computerCardSlot1.innerHTML = ''; addToTableComputer(1) }})
computerCardSlot2.addEventListener("click", function() { if (!playerTurn) { computerCardSlot2.innerHTML = ''; addToTableComputer(2) }})
computerCardSlot3.addEventListener("click", function() { if (!playerTurn) { computerCardSlot3.innerHTML = ''; addToTableComputer(3) }})

startGame()
function startGame() {
    biscaDeck = new Deck()
    biscaDeck.shuffle()
    
    computerHand.addCard(biscaDeck.deal())
    computerHand.addCard(biscaDeck.deal())
    computerHand.addCard(biscaDeck.deal())
    computerCardSlot1.appendChild(computerHand.hand[0].getHTML())
    computerCardSlot2.appendChild(computerHand.hand[1].getHTML())
    computerCardSlot3.appendChild(computerHand.hand[2].getHTML())

    trumpCard = biscaDeck.deal()
    trumpCardSlot.appendChild(trumpCard.getHTML())

    playerHand.addCard(biscaDeck.deal())
    playerHand.addCard(biscaDeck.deal())
    playerHand.addCard(biscaDeck.deal())
    playerCardSlot1.appendChild(playerHand.hand[0].getHTML())
    playerCardSlot2.appendChild(playerHand.hand[1].getHTML())
    playerCardSlot3.appendChild(playerHand.hand[2].getHTML())

    updateDeckCount()
}

function updateDeckCount() {
    biscaDeckElement.innerHTML = biscaDeck.numberOfCards
}

function addToTablePlayer(position) {
    if (playerTurn) {
        playedCard = playerHand.popPosition(position)
        table.push(playedCard)
        playedCard1Element.appendChild(playedCard.getHTML())
        playerTurn = false
        
        if (table.length == 2) {
            playerTurn = isRoundWinner(table)
            setTimeout(function() { resetBeforeTurn() }, 2000)
        }
    }
}

function addToTableComputer(position) {
    if (!playerTurn) {
        playedCard = computerHand.popPosition(position)
        table.push(playedCard)
        playedCard2Element.appendChild(playedCard.getHTML())
        playerTurn = true

        if (table.length == 2) {
            playerTurn = isRoundWinner(table)
            setTimeout(function() { resetBeforeTurn() }, 2000)
        }
    }
}

function resetBeforeTurn() {
    playedCard1Element.innerHTML = ''
    playedCard2Element.innerHTML = ''

    table = []

    computerPointsElement.innerHTML = 'POINTS: ' + scoreboard['computer'] + ' PTS'
    playerPointsElement.innerHTML = 'POINTS: ' + scoreboard['player'] + ' PTS'

    for (let i = 0; i < 3; i++) {
        if (playerCardSlots[i].innerHTML == '') {
            if (biscaDeck.numberOfCards > 0) {
                playerHand.addPosition(biscaDeck.deal(), i)
                playerCardSlots[i].appendChild(playerHand.hand[i].getHTML())
            }
                        else if (trumpCardSlot.innerHTML != '') {
                trumpCardSlot.innerHTML = ''
                computerHand.addPosition(trumpCard, i)
                computerCardSlots[i].appendChild(trumpCard.getHTML())
            }
        }
    }

    for (let i = 0; i < 3; i++) {
        if (computerCardSlots[i].innerHTML == '') {
            if (biscaDeck.numberOfCards > 0) {
                computerHand.addPosition(biscaDeck.deal(), i)
                computerCardSlots[i].appendChild(computerHand.hand[i].getHTML())
            }
            else if (trumpCardSlot.innerHTML != '') {
                trumpCardSlot.innerHTML = ''
                computerHand.addPosition(trumpCard, i)
                computerCardSlots[i].appendChild(trumpCard.getHTML())
            }
        }
    }

    updateDeckCount()
}

function isRoundWinner(table) {
    let [cardOne, cardTwo] = table
    console.log(CARD_VALUE_MAP[cardOne.value] + CARD_VALUE_MAP[cardTwo.value], cardOne.suit, cardTwo.suit)
    if (cardOne.suit == cardTwo.suit) {
        if (CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value]) {
            scoreboard[cardOne.owner] += CARD_VALUE_MAP[cardOne.value] + CARD_VALUE_MAP[cardTwo.value]
            console.log('1')
            return true
        }
        else {
            scoreboard[cardTwo.owner] += CARD_VALUE_MAP[cardOne.value] + CARD_VALUE_MAP[cardTwo.value]
            console.log('2')
            return false
        }
    }
    else if (cardOne.suit == trumpCard.suit) {
        scoreboard[cardOne.owner] += CARD_VALUE_MAP[cardOne.value] + CARD_VALUE_MAP[cardTwo.value]
        console.log('3')
        return true
    }
    else if (cardTwo.suit == trumpCard.suit) {
        scoreboard[cardTwo.owner] += CARD_VALUE_MAP[cardOne.value] + CARD_VALUE_MAP[cardTwo.value]
        console.log('4')
        return false
    }
    else {
        scoreboard[cardOne.owner] += CARD_VALUE_MAP[cardOne.value] + CARD_VALUE_MAP[cardTwo.value]
        console.log('5')
        return true
    }
}

// https://www.youtube.com/watch?v=lEk_8GlwjzA

/* 
 * Connect to Server
 * Create Game
 * 
 * 
 * 
 * 
 * opponentCardSlot1, opponentCardSlot2, opponentCardSlot3
 * 
 * 
 * trumpCardSlot, playedCardSlot1, playedCardSlot2
 * 
 * 
 * 
 * Client A creates game Z
 * Client B joins game Z
 * 
 * 
 * Join Game
 * Play
 * Broadcast State
 * Full Game Example
 * Code
 */