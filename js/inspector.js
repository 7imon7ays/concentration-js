function Inspector (board) {
  this.board = board;
  this.flippedCards = [];
}

Inspector.prototype.flipOrHideCardsOnClick = function () {
  this.board.on('click', function (evnt) {
    var $card = $(evnt.target);

    if (this.flippedCards.length > 1) {
      this.compareCards();
    } else {
      this.inspect($card);
    }

  }.bind(this));
};

Inspector.prototype.compareCards = function () {
  var cardsHaveSameNumber = !!this.flippedCards.reduce(function (prevCard, card) {
    if (prevCard.data('number') == card.data('number')) return card;
    return false;
  });

  if (cardsHaveSameNumber) {
    this.removePair();
    this.flippedCards.length = 0;
  } else {
    this.hideCards();
  }
};

Inspector.prototype.inspect = function ($card) {
  this.board.show($card);
  this.flippedCards.push($card);
};

Inspector.prototype.removePair = function () {
  this.board.remove(this.flippedCards);
};

Inspector.prototype.hideCards = function () {
  while ($card = this.flippedCards.pop()) {
    this.board.hide($card);
  }
};

