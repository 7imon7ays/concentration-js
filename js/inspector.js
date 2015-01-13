function Inspector (board) {
  this.board = board;
  this.flippedCards = [];
}

Inspector.prototype.compareCards = function () {
  if (_cardsHaveSameNumber(this.flippedCards)) {
    this.removePair();
    // Flush out flipped cards by setting length to 0
    this.flippedCards.length = 0;
  }

  this.hideCards();

  // Reduce cards to 'false' unless they all have the same number
  function _cardsHaveSameNumber (cards) {
    return !!cards.reduce(function (prevCard, card) {
      if (prevCard.data && prevCard.data('number') == card.data('number')) {
        return card;
      }

      return false;
    });
  }
};

Inspector.prototype.inspect = function ($card) {
  this.board.show($card);
  this.flippedCards.push($card);
};

Inspector.prototype.isShowingMax = function () {
  return this.flippedCards.length > 1;
};

Inspector.prototype.removePair = function () {
  this.board.remove(this.flippedCards);
};

Inspector.prototype.hideCards = function () {
  while ($card = this.flippedCards.pop()) {
    this.board.hide($card);
  }
};

