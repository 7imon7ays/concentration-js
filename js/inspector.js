function Inspector (board) {
  this.board = board;
  this.flippedCards = [];
}

Inspector.prototype.handle = function ($card) {
  var outcome = "continue";

  this.inspect($card);
  if (this.isShowingMax()) {
    outcome = this.compareCards();
  }

  return outcome;
};

Inspector.prototype.compareCards = function () {
  if (_cardsHaveSameNumber(this.flippedCards)) {
    this.removePair();
    // Flush out flipped cards by setting length to 0
    this.flippedCards.length = 0;
    return "match";
  } else {
    this.hideCards();
    return "fail";
  }

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
  if (this.isShowingMax()) throw new Error("Cannot show more cards");
  this.board.show($card);
  this.flippedCards.push($card);
};

Inspector.prototype.isShowingMax = function () {
  return this.flippedCards.length > this.constructor.MAX_MATCHES;
};

Inspector.prototype.removePair = function () {
  this.board.remove(this.flippedCards);
};

Inspector.prototype.hideCards = function () {
  while ($card = this.flippedCards.pop()) {
    this.board.hide($card);
  }
};

Inspector.MAX_MATCHES = 2;

