function Deck () {
  this.cards = [];
  this.loadCards();
}

Deck.prototype.loadCards = function () {
  var cards = this.cards;

  for (var suit in Card.SUIT_SYMBOLS) {
    for (var number in Card.NUMBER_SYMBOLS) {
      var thisCard = new Card(suit, number);

      cards.push(thisCard);
    }
  }
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

