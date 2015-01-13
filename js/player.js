function Player (id, board) {
  this.id = id;
  this.board = board;
}

Player.prototype.takeTurn = function () {
  var turnTaken = Q.defer();

  this.getInput()
  .then(function ($card) {
    turnTaken.resolve($card);
  });

  return turnTaken.promise;
};

Player.prototype.getInput = function () {
  var clicked = Q.defer();
  this.board.on('click', function (evnt) {
    var $card = $(evnt.target);

    if (!$card.hasClass('card')) return;

    this.board.off('click');
    clicked.resolve($card);
  }.bind(this));

  return clicked.promise;
};

