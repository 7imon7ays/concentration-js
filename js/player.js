function Player (board) {
  this.board = board;
  this.inspector = new Inspector(board);
}

Player.prototype.takeTurn = function () {
  var turnTaken = Q.defer();

  this.getInput()
  .then(function () {
    turnTaken.resolve();
  });

  return turnTaken.promise;
};

Player.prototype.getInput = function () {
  var clicked = Q.defer();
  this.board.on('click', function (evnt) {
    var $card = $(evnt.target);

    if (this.inspector.isShowingMax()) {
      this.inspector.compareCards();
      this.board.off('click');
      clicked.resolve();
    } else {
      if (!$card.hasClass('card')) return;
      this.pick($card);
    }
  }.bind(this));

  return clicked.promise;
};

Player.prototype.pick = function ($card) {
  if (!$card.hasClass('hidden')) return;
  this.inspector.inspect($card);
};

