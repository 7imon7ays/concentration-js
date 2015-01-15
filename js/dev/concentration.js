function Concentration () {
  this.board = null;
  this.initBoard();

  this.player1 = null;
  this.player2 = null;
  this.initPlayers();

  this.turn = new Turn(this.board, this.player1, this.player2);
  this.hud = null;
  this.initHud();
}

Concentration.prototype.initBoard = function () {
  var $boardEl = $('.board'),
      $graveyard1El = $('.graveyard#one'),
      $graveyard2El = $('.graveyard#two'),
      graveyard1 = new Graveyard($graveyard1El);
      graveyard2 = new Graveyard($graveyard2El);

  this.board = new Board($boardEl, graveyard1, graveyard2);
  this.board.layCards();
};

Concentration.prototype.initPlayers = function () {
  var $cards = $('.card');

  this.player1 = new HumanPlayer(1, this.board);
  this.player2 = new ComputerPlayer($cards, 2, this.board);
  //this.player2 = new HumanPlayer(2, this.board);
};

Concentration.prototype.initHud = function () {
  var $hud = $('.hud');

  this.hud = new Hud($hud, this.player1, this.player2);
  this.hud.render(this.board.numCards);
};

Concentration.prototype.play = function () {
  var game = this,
      gameOver = Q.defer();

  _prompt(this.player1);

  return gameOver.promise;

  function _prompt(currentPlayer) {
    game.notice('Waiting on: Player ' + currentPlayer.id);

    if (game.endCondition()) return gameOver.resolve();

    game.defer_to(currentPlayer)
    .then(function (nextOrSamePlayer) {
      _prompt(nextOrSamePlayer);
    })
    .fail(function (err) { throw err; });
  }
};

Concentration.prototype.defer_to = function (player) {
  var turnTaken = Q.defer(), game = this;

  player.takeTurn()
  .then(function ($card) {
    return game.turn.handleChoice(player, $card);
  })
  .then(function (nextOrSamePlayer) {
    var numCards = game.board.numCards;

    game.hud.render(numCards);
    turnTaken.resolve(nextOrSamePlayer);
  })
  .fail(function (err) { throw err; });

  return turnTaken.promise;
};

Concentration.prototype.endCondition = function () {
  // Game never ends for now
  return false;
};

Concentration.prototype.notice = function (msg) {
  console.log(msg);
};

