function Deck () {
  this.cards = [];
  this.loadCards();
}

Deck.prototype.loadCards = function () {
  var suitStrings = this.constructor.SUIT_STRINGS,
      numStrings = this.constructor.NUMBER_STRINGS;

  for (var suit in suitStrings) {
    for (var number in numStrings) {
      var this_suit = suitStrings[suit],
          this_number = numStrings[number];

      this.cards.push([this_suit, this_number]);
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

Deck.SUIT_STRINGS = {
  clubs:    "&clubs;",
  diamonds: "&diams;",
  hearts:   "&hearts;",
  spades:   "&spades;"
};

Deck.NUMBER_STRINGS = {
  two:   "2",
  three: "3",
  four:  "4",
  five:  "5",
  six:   "6",
  seven: "7",
  eight: "8",
  nine:  "9",
  ten:   "10",
  jack:  "J",
  queen: "Q",
  king : "K",
  ace  : "A"
};

