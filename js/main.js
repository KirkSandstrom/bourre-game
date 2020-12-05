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

// Chip class
class Chip {
  constructor() {
    this.value = 1;
    this.chipLink = 'img/chips/chipWhiteBlue_border.png';
  }
}

// Deck class
class Deck {
  constructor() {
    this.cards = [];

    this.buildDeck();
  }

  // initializes all cards and adds them to the deck
  buildDeck() {
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
        this.addCard(card);
      });
    }
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

  dealCard(player) {
    let card = this.cards.pop();
    player.hand.push(card);
  }

  dealHand(playerOrder) {
    this.shuffle();

    for(let i = 0; i < playerOrder.length; i++) {
      if(playerOrder[i].hand.length < 5) {
        this.dealCard(playerOrder[i]);
        if(i === playerOrder.length - 1) {
          i = -1;
        }
      }
    }

    // Add functionality to flip dealers 5th card up here the 'trump card'
    console.log('Flip the dealers 5th card face up here. It\'s a: ');
    console.log(playerOrder[playerOrder.length - 1].hand[4]);
  }
}

// Pot class
class Pot {
  constructor() {
    this.chips = [];
    this.previousPotSize = 0;
  }

  payout(player) {
    this.previousPotSize = this.chips.length;
    player.chips = player.chips.concat(this.chips);
    this.chips = [];
  }
}

// Player class
class Player {
  constructor(numberOfChips = 10) {
    this.hand = [];
    this.dealer = false;
    this.chips = [];

    for(let i = 0; i < numberOfChips; i++) {
      this.chips.push(new Chip());
    }
  }

  getDealer() {
    return this.dealer;
  }

  setDealer(bool) {
    this.dealer = bool;
  }

  anteUp(pot, amount = 1) {
    for(let i = 0; i < amount; i++) {
      if(this.chips.length !== 0) {
        let chip = this.chips.pop();
        pot.chips.push(chip);
      } else {
        console.log('A player has run out of chips!');
        break;
      }
    }
  }
}

// -------------------- Global Functions --------------------
// capitalizes first letter of string passed in
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// get the player order for dealing cards and playing the hand - based off who is the dealer
function getPlayerOrder(players) {
  let currentDealer = players.findIndex(player => player.getDealer() === true);

  let firstToPlay = players.slice(currentDealer + 1);
  let lastToPlay = players.slice(0, currentDealer + 1);

  let playerOrder = firstToPlay.concat(lastToPlay);

  return playerOrder;
}

// -------------------- Game Logic --------------------
let deck = new Deck();

let pot = new Pot();

let player1 = new Player();
let player2 = new Player();
let player3 = new Player();
let player4 = new Player();
let player5 = new Player();

player4.setDealer(true);

let players = [player1, player2, player3, player4, player5];

// must call getPlayerOrder before dealHand to determine the order for the hand
players = getPlayerOrder(players);
deck.dealHand(players);

players.forEach(player => player.anteUp(pot));