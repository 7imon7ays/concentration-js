(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};
  var Card = Concentration.Card = function (suit, number) {
    this.suit = suit;
    this.number = number;
  };

  Card.prototype.span = function () {
    return $('<span>').append(this.suitSyms(this.suit))
                      .append(this.numSyms(this.number));
  };

  Card.prototype.divTag = function () {
    var $div = $('<div>');
    $div.addClass(this.constructor.htmlClass)
        .addClass('round-corner')
        .addClass('hidden');

    if (this.suit == "hearts" || this.suit == "diamonds") {
      $div.addClass('red');
    }

    $div.data('number', this.number);

    return $div;
  };

  Card.prototype.htmlTag = function () {
    var $span = this.span(),
        divTag = this.divTag();

    divTag.append($span);

    return divTag[0];
  };

  Card.htmlClass = 'card';

  Card.prototype.suitSyms = function (suit) {
    return this.constructor.SUIT_SYMBOLS[suit];
  };

  Card.prototype.numSyms = function (num) {
    return this.constructor.NUMBER_SYMBOLS[num];
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
})();

