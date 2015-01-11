function Board($el) {
  this.render = function (content) {
    $el.html(content);
  };
  this.deck = new Deck();
}

Board.prototype.buildCardTags = function () {
  return this.deck.cards.map(function (c) {
    var $div = $('<div>'), suit = c[0], num = c[1];

    $div.addClass('card');

    if (suit == "&hearts;" || suit == "&diams;") {
      $div.addClass('red');
    }

    $div.append(suit)
        .append(num);
    return $div[0];
  });
};

Board.prototype.layCards = function () {
  var cardTags = this.buildCardTags();

  this.render(cardTags);
};

var board = new Board($('.content'));

board.layCards();
