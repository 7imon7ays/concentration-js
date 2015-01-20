(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};

  // Inherits from Player class
  var HumanPlayer = Concentration.HumanPlayer = function (args) {
    Concentration.Player.apply(this, arguments);
  };

  // Not ideal because Player class must be declared first.
  // Can't wait for doc ready either lest HumanPlayer proto gets overriden
  // Investigate more flexible inheritance
  HumanPlayer.prototype = Object.create(Concentration.Player.prototype);
  HumanPlayer.prototype.constructor = HumanPlayer;

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
})();

