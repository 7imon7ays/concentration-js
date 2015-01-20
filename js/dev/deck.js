(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};

  var Deck = Concentration.Deck = function () {
    this.cards = [];
    this.loadCards();
  };

  Deck.prototype.loadCards = function () {
    var cards = this.cards;

    for (var suit in Concentration.Card.SUIT_SYMBOLS) {
      for (var number in Concentration.Card.NUMBER_SYMBOLS) {
        var thisCard = new Concentration.Card(suit, number);

        cards.push(thisCard);
      }
    }
  };

  Deck.prototype.count = function () {
    return this.cards.length;
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
})();

