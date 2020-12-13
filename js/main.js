// -------------------- Classes --------------------

// Card class
class Card {
  constructor(cardID, suit, value, cardFaceLink, cardBackLink = "img/cardBacks/cardBack_red5.png") {
    this.cardID = cardID;
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
    this.discardPile = [];

    this.buildDeck();
  }

  // initializes all cards and adds them to the deck
  buildDeck() {
    let cardID = 1;
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
        let card = new Card(cardID, suit, cardValue, cardImgLink);
        this.addCard(card);
        cardID++;
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

    game.setTrumpCard(playerOrder[playerOrder.length - 1].hand[4]);
  }

  pullFromDiscardPile() {
    this.cards = this.cards.concat(this.discardPile);
    this.discardPile = [];

    this.shuffle();
  }
}

// Game class
class Game {
  constructor(opponents, startingChips = 10) {
    this.opponents = opponents;

    this.deck = new Deck();
    this.pot = new Pot();
    this.players = [];

    this.trumpCard = null;
    this.leadCard = null;

    // create npc players here
    for(let i = 0; i < this.opponents; i++) {
      this.players.push(new PlayerNPC(`npc${i + 1}`, startingChips));
    }

    // create human player here
    this.players.push(new PlayerHuman('humanPlayer', startingChips));

    // randomly choose a player to be the starting dealer
    this.players[getRandomInt(this.players.length)].setDealer(true);

    // set order of the players so we are ready to deal the first hand
    this.players = this.getPlayerOrder();
  }

  // get the player order for dealing cards and playing the hand - based off who is the dealer
  getPlayerOrder() {
    let currentDealer = this.players.findIndex(player => player.getDealer() === true);

    let firstToPlay = this.players.slice(currentDealer + 1);
    let lastToPlay = this.players.slice(0, currentDealer + 1);

    let playerOrder = firstToPlay.concat(lastToPlay);

    return playerOrder;
  }

  playHand() {
    // players must contribute initial ante
    this.players.forEach(player => player.anteUp(this.pot));

    // deal cards out to each player
    this.deck.dealHand(this.players, this);

    // players decide if they want to pass or play on the hand, then exchange cards if needed
    this.players.forEach(player => player.passOrPlay());
  }

  setTrumpCard(card) {
    this.trumpCard = card;
  }

  getTrumpCard() {
    return this.trumpCard;
  }

  setLeadCard(card) {
    this.leadCard = card;
  }

  getLeadCard() {
    return this.leadCard;
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
    console.log(`${player.name} wins the pot!`);
  }
}

// Player class
class Player {
  constructor(name, numberOfChips = 10) {
    this.name = name;
    this.hand = [];
    this.dealer = false;
    this.chips = [];
    this.playing = true;

    for(let i = 0; i < numberOfChips; i++) {
      this.chips.push(new Chip());
    }
  }

  exchangeCard(cardID, deck) {
    const cardIndex = this.hand.findIndex(card => card.cardID === cardID);

    if(cardIndex !== -1) {
      let card = this.hand.splice(cardIndex, 1);
      card = card[0];
      console.log(card);
      deck.discardPile.unshift(card);
      deck.dealCard(this);
    } else {
      console.log('Card to be exchanged not found in hand!');
    }
  }

  getDealer() {
    return this.dealer;
  }

  setDealer(bool) {
    this.dealer = bool;
    if(bool === true) {
      console.log(`${this.name} is the dealer.`);
    }
  }

  getPlaying() {
    return this.playing;
  }

  setPlaying(bool) {
    this.playing = bool;
  }

  anteUp(pot, amount = 1) {
    for(let i = 0; i < amount; i++) {
      if(this.chips.length !== 0) {
        let chip = this.chips.pop();
        pot.chips.push(chip);
        console.log(`${this.name} antes a chip.`);
      } else {
        console.log(`${this.name} has run out of chips!`);
        break;
      }
    }
  }
}

// PlayerNPC class - computer controlled player
class PlayerNPC extends Player {
  constructor(name, numberOfChips = 10) {
    super(name, numberOfChips);
  }

  exchangeCards() {
    console.log(`NPC player ${this.name} is exchanging cards. Original hand is:`);
    console.log(this.hand);

    const cardsForExchange = this.hand.filter(card => card.suit !== game.getTrumpCard().suit && card.value < 6);

    console.log('Cards for exchange are:')
    console.log(cardsForExchange);

    if(cardsForExchange.length > 0) {
      for(let i = 0; i < cardsForExchange.length; i++) {
        const cardID = cardsForExchange[i].cardID;
        super.exchangeCard(cardID, game.deck);
      }
    }

    console.log('New hand is:');
    console.log(this.hand);
  }

  passOrPlay() {
    // find any trump cards in the players hand
    const trumpCards = this.hand.filter(card => card.suit === game.getTrumpCard().suit);
    // find any high cards in the players hand
    const highCards = this.hand.filter(card => card.value > 8);
    // this will add some randomness into the decision to pass or play
    const random = getRandomInt(100);

    if(super.getDealer() === true && game.getTrumpCard().value === 14) {
      // dealer must play if the trump card is an ace since ace trump cards will always win a trick
      super.setPlaying(true);
      alert(`${this.name} must play since he holds the ace trump card.`);

      this.exchangeCards();
    } else if(trumpCards.length > 1 || highCards.length > 3 || random <= 70) {
      super.setPlaying(true);
      console.log(`${this.name} is playing with ${trumpCards.length} trumpcards and ${highCards.length} highcards - random = ${random}`);

      this.exchangeCards();
    } else {
      super.setPlaying(false);
      console.log(`${this.name} passed`);
    }
  }
}

// PlayerHuman class - human controlled player
class PlayerHuman extends Player {
  constructor(name, numberOfChips = 10) {
    super(name, numberOfChips);
  }

  // CLEAN THIS UP!!
  // may need to update this later
  exchangeCards() {
    console.log(`Human player is exchanging cards. Original hand is:`);
    this.hand.forEach(card => console.log(`CardID: ${card.cardID} CardValue: ${card.value} Suit: ${card.suit}`));

    let cardIDs = prompt(`Enter card IDs you want to exchange below - separated by commas.`);
    cardIDs = cardIDs.split(',');
    console.log(cardIDs);

    const cardsForExchange = this.hand.filter(function(card) {
      return cardIDs.includes(card.cardID.toString());
    });

    console.log('Cards for exchange are:')
    console.log(cardsForExchange);

    if(cardsForExchange.length > 0) {
      for(let i = 0; i < cardsForExchange.length; i++) {
        const cardID = cardsForExchange[i].cardID;
        super.exchangeCard(cardID, game.deck);
      }
    }

    console.log('New hand is:');
    console.log(this.hand);
  }

    // this will need to be updated later, just getting things working for now
  passOrPlay() {
    console.log('Human player needs to pass or play!');

    if(super.getDealer() === true && game.getTrumpCard().value === 14) {
      // dealer must play if the trump card is an ace since ace trump cards will always win a trick
      super.setPlaying(true);
      alert(`${this.name} must play since he holds the ace trump card.`);

      this.exchangeCards();
    } else {
      let passOrPlay = prompt("Would you like to play this hand? (y/n)");

      if(passOrPlay.toLowerCase() === 'y') {
        super.setPlaying(true);
        this.exchangeCards();
      } else {
        super.setPlaying(false);
        console.log('Human player is passing.');
      }
    }
  }
}

// -------------------- Global Functions --------------------
// capitalizes first letter of string passed in
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// returns a random number between 0 and max
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// -------------------- Game Logic --------------------
let game = new Game(4);
game.playHand();
