function Inspector (board) {
  this.board = board;
  this.flipCardsOnClick();
}

Inspector.prototype.flipCardsOnClick = function () {
  this.board.on('click', function (evnt) {
    var $card = $(evnt.target);
    $card.removeClass('hidden');
  });
};

