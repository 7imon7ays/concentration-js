function Card (suit, number) {
  this.suit = suit;
  this.number = number;
}

Card.prototype.htmlTag = function () {
  var $div = $('<div>'), $span = $('<span>'),
      suit = this.suit, num = this.number, klass = this.constructor,
      suitSyms = klass.SUIT_SYMBOLS, numSyms = klass.NUMBER_SYMBOLS;

  $span.append(suitSyms[suit])
    .append(' ')
    .append(numSyms[num]);

  $div.append($span);
  $div.addClass(klass.htmlClass)
      .addClass('hidden');

  if (suit == "hearts" || suit == "diamonds") {
    $div.addClass('red');
  }

  $div.data('number', num);

  return $div[0];
};

Card.htmlClass = 'card';

Card.SUIT_SYMBOLS = {
  clubs:    "&clubs;",
  diamonds: "&diams;",
  hearts:   "&hearts;",
  spades:   "&spades;"
};

Card.NUMBER_SYMBOLS = {
  two:   "2",
  three: "3",
};

/*
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
  */
