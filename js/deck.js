function Deck () {
  this.cards = [];
  this.loadCards();
}

Deck.prototype.loadCards = function () {
  var suitStrings = this.constructor.SUIT_STRINGS,
      numStrings = this.constructor.NUMBER_STRINGS,
      cards = this.cards;

  suitStrings.forEach(function (suit) {
    numStrings.forEach(function (number) {
      var thisCard = new Card(suit, number);

      cards.push(thisCard);
    });
  });
};

Deck.prototype.shuffle = function () {
 /*
  * As seen on stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  */
  var currentIndex = this.cards.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = this.cards[currentIndex];
    this.cards[currentIndex] = this.cards[randomIndex];
    this.cards[randomIndex] = temporaryValue;
  }

  return this;
};

Deck.SUIT_STRINGS = [
  'clubs',
  'diamonds',
  'hearts',
  'spades'
];

Deck.NUMBER_STRINGS = [
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'jack',
  'queen',
  'king',
  'ace'
];

