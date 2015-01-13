function Concentration () {
  var $graveyardEl = $('.graveyard'),
      graveyard = new Graveyard($graveyardEl);

  this.$boardEl = $('.board');
  this.board = new Board(this.$boardEl, graveyard);
  this.inspector = new Inspector(this.board);
  this.player1 = new Player(1, this.board);
  this.player2 = new Player(2, this.board);
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
    console.log('Waiting on: Player', currentPlayer.id);
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
  .then(function ($card) {
    var turnOutcome = this.inspector.handle($card);
    turnCompleted.resolve( turnOutcome == "fail" ? nextPlayer : currentPlayer );
  }.bind(this))
  .fail(function (error) {
    this.notice(error);
  }.bind(this));

  return turnCompleted.promise;
};

Concentration.prototype.endCondition = function () {
  // Game never ends for now
  return false;
};

Concentration.prototype.notice = function (msg) {
  console.log(msg);
};

new Concentration().start();

