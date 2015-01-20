(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};
  
  var Game = Concentration.Game = function () {
    this.board = null;
    this.initBoard();

    this.player1 = null;
    this.player2 = null;
    this.turn = null;
    this.hud = null;

    this.listenForPlayerOptions()
        .then(function (playerOptions) {
          this.start(playerOptions);
        }.bind(this))
        .fail(function (err) { throw err; });
  };

  Game.prototype.listenForPlayerOptions = function () {
    var playersSelected = Q.defer();

    $("input.start").on("click", function () {
      var $hud = $(".hud"),
          player1IsHuman = $hud.find("input#player_1_human").prop("checked"),
          player2IsHuman = $hud.find("input#player_2_human").prop("checked"),
          playerOptions = {
            humanPlayer1: player1IsHuman,
            humanPlayer2: player2IsHuman
          };

    playersSelected.resolve(playerOptions);
    });

    return playersSelected.promise;
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

  Game.prototype.initPlayers = function (playerOptions) {
    var HumPlay = Concentration.HumanPlayer,
        CompPlay = Concentration.ComputerPlayer,
        $cards = $('.content .card');

    if (playerOptions.humanPlayer1) {
      this.player1 = new HumPlay(1, this.board);
    } else {
      this.player1 = new CompPlay($cards, 20, 1, this.board);
    }

    if (playerOptions.humanPlayer2) {
      this.player2 = new HumPlay(2, this.board);
    } else {
      this.player2 = new CompPlay($cards, 20, 2, this.board);
    }
  };

  Game.prototype.initHud = function () {
    var $hud = $('.hud');

    this.hud = new Concentration.Hud($hud, this.player1, this.player2);
    this.hud.render(this.board.numCards);
  };

  Game.prototype.start = function (playerOptions) {
    this.initPlayers(playerOptions);
    this.turn = new Concentration.Turn(this.board, this.player1, this.player2);
    this.initHud();

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

