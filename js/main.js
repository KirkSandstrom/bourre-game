// -------------------- Classes --------------------

// Card class
class Card {
  constructor(suit, value, cardFaceLink, cardBackLink = "img/cardBacks/cardBack_red5.png") {
    this.suit = suit;
    this.value = value;
    this.cardFaceLink = cardFaceLink;
    this.cardBackLink = cardBackLink;
  }
}

// Deck class
class Deck {
  constructor(dealer) {
    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  // shuffle the deck using the Fisher-Yates algorithm
  shuffle() {
    let a = this.cards;
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  }
}

// -------------------- Global Functions --------------------
// capitalizes first letter of string passed in
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// initializes all cards and adds them to the deck
function buildDeck(deck) {
  let suits = ['clubs', 'diamonds', 'hearts', 'spades'];
  let cardImgLink ='';
  for(let cardValue = 2; cardValue < 15; cardValue++) {
    suits.forEach(suit => {
      // cardValues of 11 - 14 are face cards so set the cardImgLink to J, Q, K, A accordingly
      switch(cardValue) {
        case 11 :
          cardImgLink = `img/cardFaces/card${capitalizeFirstLetter(suit)}J.png`;
          break;
        case 12 :
          cardImgLink = `img/cardFaces/card${capitalizeFirstLetter(suit)}Q.png`;
          break;
        case 13 :
          cardImgLink = `img/cardFaces/card${capitalizeFirstLetter(suit)}K.png`;
          break;
        case 14 :
          cardImgLink = `img/cardFaces/card${capitalizeFirstLetter(suit)}A.png`;
          break;
        default :
          cardImgLink = `img/cardFaces/card${capitalizeFirstLetter(suit)}${cardValue}.png`;
      }
      let card = new Card(suit, cardValue, cardImgLink);
      deck.addCard(card);
    });
  }
}

// -------------------- Game Logic --------------------
let deck = new Deck();
buildDeck(deck);