function Card (suit, number) {
  this.suit = suit;
  this.number = number;
}

Card.prototype.htmlTag = function () {
  var $div = $('<div>'),
      suit = this.suit, num = this.number, cons = this.constructor,
      suitSyms = cons.SUIT_SYMBOLS, numSyms = cons.NUMBER_SYMBOLS;

  $div.addClass('card');

  if (suit == "hearts" || suit == "diamonds") {
    $div.addClass('red');
  }

  $div.append(suitSyms[suit])
      .append(' ')
      .append(numSyms[num]);

  return $div[0];
};

Card.SUIT_SYMBOLS = {
  clubs:    "&clubs;",
  diamonds: "&diams;",
  hearts:   "&hearts;",
  spades:   "&spades;"
};

Card.NUMBER_SYMBOLS = {
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

