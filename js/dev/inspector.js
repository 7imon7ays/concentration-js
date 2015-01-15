function Inspector (board) {
  this.board = board;
  this.flippedCards = [];
}

Inspector.prototype.evaluateChoice = function ($card) {
  var outcome = "continue";

  this.flippedCards.push($card);
  this.inspect($card);
  if (this.isShowingMax()) {
    outcome = this.compareCards();
  }

  return outcome;
};

Inspector.prototype.compareCards = function () {
  if (_cardsHaveSameNumber(this.flippedCards)) {
    // Flush out flipped cards by setting length to 0
    return "match";
  } else {
    return "miss";
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
  this.board.show($card);
};

Inspector.prototype.isShowingMax = function () {
  return this.flippedCards.length >= this.constructor.MAX_MATCHES;
};

Inspector.prototype.removeMatches = function (player) {
  this.board.remove(this.flippedCards, player);
  this.flush();
};

Inspector.prototype.hideCards = function () {
  this.flippedCards.forEach(function($card) {
    this.board.hide($card);
  }.bind(this));

  this.flush();
};

Inspector.prototype.flush = function () {
  this.flippedCards.length = 0;
};

Inspector.MAX_MATCHES = 2;

