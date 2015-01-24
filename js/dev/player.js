(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};

  // Superclass of ComputerPlayer and HumanPlayer
  var Player = Concentration.Player = function (id, board) {
    this.id = id;
    this.board = board;
    this.numMatches = 0;
  };

  Player.prototype.recordNewMatch = function () {
    this.numMatches++;
  };
})();

