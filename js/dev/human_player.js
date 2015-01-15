// Inherits from Player class
function HumanPlayer(args) {
  Player.apply(this, arguments);
}

HumanPlayer.prototype = Object.create(Player.prototype);
HumanPlayer.prototype.constructor = Player;

HumanPlayer.prototype.getInput = function () {
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

HumanPlayer.prototype.confirmNextTurn = function () {
  var $window = $(window), clicked = Q.defer();

  $window.on('click', function () {
    clicked.resolve();
    $window.off('click');
  });

  return clicked.promise;
};

