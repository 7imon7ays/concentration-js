function Concentration () {
  this.board = null;
  this.initBoard();

  this.inspector = new Inspector(this.board);

  this.player1 = null;
  this.player2 = null;
  this.initPlayers();
}

Concentration.prototype.initBoard = function () {
  var $boardEl = $('.board'),
      $graveyardEl = $('.graveyard'),
      graveyard = new Graveyard($graveyardEl);

  this.board = new Board($boardEl, graveyard);
  this.board.layCards();
};

Concentration.prototype.initPlayers = function () {
  var $cards = $('.card');

  this.player1 = new HumanPlayer(1, this.board);
  this.player2 = new ComputerPlayer($cards, 2, this.board);
};

Concentration.prototype.play = function () {
  var game = this;
  var gameOver = Q.defer();

  _invite(this.player1);

  function _invite(currentPlayer) {
    game.notice('Waiting on: Player ' + currentPlayer.id);
    if (game.endCondition()) return gameOver.resolve();

    game.turn(currentPlayer)
    .then(function (nextPlayer) {
      _invite(nextPlayer);
    })
    .fail(function (err) { throw err; });
  }

  return gameOver.promise;
};

Concentration.prototype.turn = function (player) {
  var madeMove = Q.defer();

  player.takeTurn()
  .then(function ($card) {
    this.handleChoice(player, $card, madeMove);
  }.bind(this))
  .fail(function (err) { throw err; });

  return madeMove.promise;
};

Concentration.prototype.handleChoice = function (player, $chosenCard, completedPromise) {
  var currentPlayer = (player == this.player1 ? this.player1 : this.player2),
      nextPlayer = (player == this.player1 ? this.player2 : this.player1);

  var turnOutcome = this.inspector.evaluateChoice($chosenCard);

  switch(turnOutcome) {
    case "continue":
      // Player keeps going if the max number of cards
      // hasn't been flipped
      completedPromise.resolve(currentPlayer);
      break;
    case "match":
      currentPlayer.confirmNextTurn()
      .then(function () {
        this.inspector.removeMatches();
        completedPromise.resolve(currentPlayer);
      }.bind(this))
      .fail(function (err) { throw err; });
      break;
    case "miss":
      currentPlayer.confirmNextTurn()
      .then(function () {
        this.inspector.hideCards();
        completedPromise.resolve(nextPlayer);
      }.bind(this))
      .fail(function (err) { throw err; });
      break;
    default:
      throw new Error("Unknown choice outcome");
  }
};

Concentration.prototype.endCondition = function () {
  // Game never ends for now
  return false;
};

Concentration.prototype.notice = function (msg) {
  console.log(msg);
};

$(function () {
  new Concentration().play();
});

