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
  } else {
    this.hideCards();
  }
};

Inspector.prototype.inspect = function ($card) {
  $card.removeClass('hidden');
  this.flippedCards.push($card);
};

Inspector.prototype.removePair = function () {
  console.log('Matched cards');
};

Inspector.prototype.hideCards = function () {
  while ($card = this.flippedCards.pop()) {
    $card.addClass('hidden');
  }
};

