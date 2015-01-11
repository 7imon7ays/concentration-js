function Board($el) {
  this.render = function (content) {
    $el.html(content);
  };
  this.deck = new Deck().shuffle();
}

Board.prototype.buildCardTags = function () {
  return this.deck.cards.map(function (c) {
    return c.htmlTag();
  });
};

Board.prototype.layCards = function () {
  var cardTags = this.buildCardTags();

  this.render(cardTags);
};

var board = new Board($('.content'));

board.layCards();

