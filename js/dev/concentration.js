(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};
  
  var Game = Concentration.Game = function () {
    this.board = null;
    this.initBoard();

    this.player1 = null;
    this.player2 = null;
    this.initPlayers();

    this.turn = new Concentration.Turn(this.board, this.player1, this.player2);
    this.hud = null;
    this.initHud();
  };

  Game.prototype.initBoard = function () {
    var $boardEl = $('.board'),
        $graveyard1El = $('.graveyard#one'),
        $graveyard2El = $('.graveyard#two'),
        graveyard1 = new Concentration.Graveyard($graveyard1El);
        graveyard2 = new Concentration.Graveyard($graveyard2El);

    this.board = new Concentration.Board($boardEl, graveyard1, graveyard2);
    this.board.layCards();
  };

  Game.prototype.initPlayers = function () {
    var $cards = $('.card');

    this.player1 = new Concentration.HumanPlayer(1, this.board);
    //this.player2 = new Concentration.HumanPlayer(2, this.board);
    //this.player1 = new Concentration.ComputerPlayer($cards, 20, 1, this.board);
    this.player2 = new Concentration.ComputerPlayer($cards, 20, 2, this.board);
  };

  Game.prototype.initHud = function () {
    var $hud = $('.hud');

    this.hud = new Concentration.Hud($hud, this.player1, this.player2);
    this.hud.render(this.board.numCards);
  };

  Game.prototype.start = function () {
    this.play()
        .then(function () {
          var msg = this.gameEndMessage();
          this.hud.announceWinner(msg);
        }.bind(this))
        .fail(function (err) { throw err; });
  };

  Game.prototype.gameEndMessage = function () {
      var player1Score = this.player1.numMatches,
          player2Score = this.player2.numMatches;

      if (player1Score > player2Score) {
        return "Player 1 wins";
      } else if (player2Score > player1Score) {
        return "Player 2 wins";
      } else {
        return "Draw";
      }
  };

  Game.prototype.play = function () {
    var game = this,
        gameOver = Q.defer();

    _prompt(this.player1);

    return gameOver.promise;

    function _prompt(currentPlayer) {
      if (game.endCondition()) return gameOver.resolve();

      game.defer_to(currentPlayer)
      .then(function (nextOrSamePlayer) {
        _prompt(nextOrSamePlayer);
      })
      .fail(function (err) { throw err; });
    }
  };

  Game.prototype.defer_to = function (player) {
    var turnTaken = Q.defer(), game = this;

    player.takeTurn()
    .then(function ($card) {
      return game.turn.handleChoice(player, $card);
    })
    .then(function (nextOrSamePlayer) {
      var numCards = game.board.numCards;

      game.hud.render(numCards, nextOrSamePlayer);
      turnTaken.resolve(nextOrSamePlayer);
    })
    .fail(function (err) { throw err; });

    return turnTaken.promise;
  };

  Game.prototype.endCondition = function () {
    return !this.board.numCards;
  };
})();

