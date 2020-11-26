// -------------------- Classes --------------------

// Deck class
class Deck {
  constructor(dealer) {
    this.dealer = dealer;
    this.cards = [];
  }

  getDealer() {
    return this.dealer;
  }

  setDealer(dealer) {
    this.dealer = dealer;
  }

  addCard(card) {
    this.cards.push(card);
  }
}

// Card class
class Card {
  constructor(suit, value, cardFaceLink, cardBackLink = "img/cardBacks/cardBack_red5.png") {
    this.suit = suit;
    this.value = value;
    this.cardFaceLink = cardFaceLink;
    this.cardBackLink = cardBackLink;
  }
}

// -------------------- Game Logic --------------------
let deck = new Deck('testPlayer');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let suits = ['clubs', 'diamonds', 'hearts', 'spades'];
for(let i = 2; i < 14; i++) {
  suits.forEach(suit => {
    // ADD STATEMENT TO CHECK FOR FACE CARDS AND UPDATE IMG LINK ACCORDINGLY
    let card = new Card(suit, i, `img/cardFaces/card${capitalizeFirstLetter(suit)}${i}.png`);
    deck.addCard(card);
  });
}
