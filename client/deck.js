const SUITS = ["♠", "♣", "♥", "♦"]
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "J", "Q", "K"]

/**
 * Constructor. Create an unshuffled deck of cards.
 */
export class Deck {
    constructor(cards = freshDeck()) {
        this.cards = cards
    }

    get numberOfCards() {
        return this.cards.length
    }

    deal() {
        return this.cards.pop()
    }

    shuffle() {
        for (let i = this.numberOfCards - 1; i > 0; i--) {
            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
        }
    }
}

/**
 * Constructor. 
 */
export class Hand {
    constructor(owner) {
        this.hand = []
        this.owner = owner
    }

    get numberOfCards() {
        return this.hand.length
    }

    clear() {
        this.hand = []
    }

    addCard(card) {
        this.hand.push(card)
        card.owner = this.owner
    }

    addPosition(card, position) {
        this.hand[position] = card
        card.owner = this.owner
    }

    popPosition(position) {
        let temp = this.hand[position - 1]
        this.hand[position - 1] = null
        return temp
    }



}

/**
 * Constructor. 
 */
class Card {
    constructor(suit, value) {
        this.suit = suit
        this.value = value
        this.owner = null
    }

    get color() {
        return this.suit == '♠' || this.suit == '♣' ? 'black' : 'red'
    }

    getHTML() {
        const cardDiv = document.createElement('div')
        cardDiv.innerText = this.suit
        cardDiv.classList.add("card", this.color)
        cardDiv.dataset.value = `${this.value} ${this.suit}`
        return cardDiv
    }
}

function freshDeck() {
    return SUITS.flatMap(suit => {
        return VALUES.map(value => {
            return new Card(suit, value, null)
        })
    })
}