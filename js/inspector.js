function Inspector (board) {
  this.board = board;
  this.flippedCards = [];
}

Inspector.prototype.flipOrHideCardsOnClick = function () {
  // Use a single listener for the whole board
  // but only inspect if user clicked a specific card
  this.board.on('click', function (evnt) {
    var $card = $(evnt.target);

    if (this.flippedCards.length > 1) {
      this.compareCards();
    } else {
      if (!$card.hasClass('card')) return;
      this.inspect($card);
    }

  }.bind(this));
};

Inspector.prototype.compareCards = function () {
  // Reduce cards to 'false' unless they all have the same number
  var cardsHaveSameNumber = !!this.flippedCards.reduce(function (prevCard, card) {
    if (prevCard.data('number') == card.data('number')) return card;
    return false;
  });

  if (cardsHaveSameNumber) {
    this.removePair();
    // Flush out flipped cards by setting length to 0
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

