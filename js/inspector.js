function Inspector (board) {
  this.board = board;
  this.flippedCards = [];
}

Inspector.prototype.flipOrHideCardsOnClick = function () {
  this.board.on('click', function (evnt) {
    var $card = $(evnt.target);

    if (this.flippedCards.length > 1) {
      this.hideCards();
    } else {
      this.inspect($card);
    }

  }.bind(this));
};

Inspector.prototype.inspect = function ($card) {
  this.flippedCards.push($card);
  $card.removeClass('hidden');
};

Inspector.prototype.hideCards = function () {
  while ($card = this.flippedCards.pop()) {
    $card.addClass('hidden');
  }
};

