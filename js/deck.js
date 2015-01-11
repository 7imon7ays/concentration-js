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

