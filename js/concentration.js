function Concentration () {
  var $graveyardEl = $('.graveyard'),
      graveyard = new Graveyard($graveyardEl);

  this.$boardEl = $('.board');
  this.board = new Board(this.$boardEl, graveyard);
  this.player1 = new Player(this.board);
  this.player2 = new Player(this.board);
}

Concentration.prototype.start = function () {
  this.board.layCards();
  this.play();
};

Concentration.prototype.play = function () {
  var game = this;
  var gameOver = Q.defer();

  _invite(this.player1);

  function _invite(currentPlayer) {
    if (game.endCondition()) return gameOver.resolve();

    game.turn(currentPlayer)
    .then(function (nextPlayer) {
      _invite(nextPlayer);
    })
    .fail(function (error) {
      game.notice(error);
    });
  }

  return gameOver.promise;
};

Concentration.prototype.turn = function (player) {
  var currentPlayer = (player == this.player1 ? this.player1 : this.player2),
      nextPlayer = (player == this.player1 ? this.player2 : this.player1),
      turnCompleted = Q.defer();

  currentPlayer.takeTurn()
  .then(function () {
    turnCompleted.resolve(nextPlayer);
  });

  return turnCompleted.promise;
};

Concentration.prototype.endCondition = function () {
  // Game never ends for now
  return false;
};

Concentration.prototype.notice = function (msg) {
  alert(msg);
};

new Concentration().start();

