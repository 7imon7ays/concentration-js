function Board($el) {
  this.$el = $el;
  this.deck = new Deck().shuffle();
}

Board.prototype.render = function (content) {
  this.$el.html(content);
};

Board.prototype.buildCardTags = function () {
  return this.deck.cards.map(function (card) {
    return card.htmlTag();
  });
};

Board.prototype.layCards = function () {
  var cardTags = this.buildCardTags();

  this.render(cardTags);
};

Board.prototype.on = function (evnt, callback) {
  this.$el.on(evnt, callback);
};

