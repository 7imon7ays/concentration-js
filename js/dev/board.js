(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};

  var Board = Concentration.Board = function ($el, graveyard1, graveyard2) {
    this.$el = $el;
    this.graveyard1 = graveyard1;
    this.graveyard2 = graveyard2;
    this.deck = new Concentration.Deck().shuffle();
    this.numCards = this.deck.count();
  };

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

  Board.prototype.show = function ($card) {
    $card.trigger('showing');
    $card.removeClass('hidden');
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

  Board.prototype.remove = function ($cards, player) {
    var graveyard = (player.id == 1 ? this.graveyard1 : this.graveyard2);

    graveyard.add($cards);
    this.numCards -= $cards.length;
    $cards.forEach(function ($card) {
      $card.addClass('removed');
      $card.trigger('matched');
    });
  };
})();

