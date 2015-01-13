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

    // Ignore click if player didn't click a card
    // Or clicked a revealed card
    if (!$card.hasClass('card') || !$card.hasClass('hidden')) return;

    this.board.off('click');
    clicked.resolve($card);
  }.bind(this));

  return clicked.promise;
};

Player.prototype.confirmNextTurn = function () {
  var $window = $(window), clicked = Q.defer();

  $window.on('click', function () {
    clicked.resolve();
    $window.off('click');
  });

  return clicked.promise;
};

