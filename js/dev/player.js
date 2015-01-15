// Superclass of ComputerPlayer and HumanPlayer

function Player (id, board) {
  this.id = id;
  this.board = board;
}

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

