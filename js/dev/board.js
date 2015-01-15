function Board($el, graveyard) {
  this.$el = $el;
  this.graveyard = graveyard;
  this.deck = new Deck().shuffle();
  this.numCards = this.deck.count();
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

Board.prototype.show = function (cardTag) {
  cardTag.removeClass('hidden');
};

Board.prototype.hide = function (cardTag) {
  cardTag.addClass('hidden');
};

Board.prototype.on = function (evnt, callback) {
  this.$el.on(evnt, callback);
};

Board.prototype.off = function (evnt) {
  this.$el.off(evnt);
};

Board.prototype.remove = function (cardTags) {
  this.graveyard.add(cardTags);
  this.numCards -= cardTags.length;
  cardTags.forEach(function (cardTag) {
    cardTag.addClass('removed');
  });
};
