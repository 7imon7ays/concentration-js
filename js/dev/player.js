(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};

  // Superclass of ComputerPlayer and HumanPlayer
  var Player = Concentration.Player = function (id, board) {
    this.id = id;
    this.board = board;
    this.numMatches = 0;
  };

  Player.prototype.takeTurn = function () {
    var turnTaken = Q.defer();

    this.getInput()
    .then(function ($card) {
      turnTaken.resolve($card);
    })
    .fail(function (err) {
      throw err;
    });

    return turnTaken.promise;
  };

  Player.prototype.recordNewMatch = function () {
    this.numMatches++;
  };
})();

