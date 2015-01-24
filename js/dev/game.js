(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};
  
  var Game = Concentration.Game = function () {
    var $boardEl = $('.board'),
        $graveyard1El = $('.graveyard.one'),
        $graveyard2El = $('.graveyard.two'),
        $hud = $('.hud'),
        $playerTypeButtons = $('button.player_type'),
        $player1TypeButton = $('.player.one > button.player_type'),
        $player2TypeButton = $('.player.two > button.player_type'),
        $startButton = $('button.start');

    this.$startButton = $startButton;

    this.board = null;
    // Players are initialized after user clicks "start"
    this.player1 = null;
    this.player2 = null;
    this.turn = null;
    this.hud = null;
    this.config = null;
    this.initBoard($boardEl, $graveyard1El, $graveyard2El);

    // Bind cards after they're laid in initBoard
    var $cards = $('.content .card');
    this.$cards = $cards;

    this.initHud($hud);
    this.initConfig($playerTypeButtons, $player1TypeButton, $player2TypeButton);
  };

  Game.prototype.initConfig = function ($playerTypeButtons, $player1TypeButton, $player2TypeButton) {
    this.config = new Concentration.Config(
        $playerTypeButtons,
        $player1TypeButton,
        $player2TypeButton);

    this.config.listenForGameConfig();
  };

  Game.prototype.listenForGameStart = function () {
    this.$startButton.on('click', function () {
      var gameOptions = this.config.gameOptions();

      this.initPlayers(gameOptions);
      this.hud.setPlayers(this.player1, this.player2);
      this.hud.render(this.board.numCards);
      this.config.removeListeners();
      this.start();
    }.bind(this));
  };

  Game.prototype.initBoard = function ($boardEl, $graveyard1El, $graveyard2El) {
        graveyard1 = new Concentration.Graveyard($graveyard1El);
        graveyard2 = new Concentration.Graveyard($graveyard2El);

    this.board = new Concentration.Board($boardEl, graveyard1, graveyard2);
    this.board.layCards();
  };

  Game.prototype.initPlayers = function (gameOptions) {

    if (gameOptions.player1IsHuman) {
      this.player1 = new Concentration.HumanPlayer(1, this.board);
    } else {
      this.player1 = new Concentration.ComputerPlayer(this.$cards, 20, 1, this.board);
    }

    if (gameOptions.player2IsHuman) {
      this.player2 = new Concentration.HumanPlayer(2, this.board);
    } else {
      this.player2 = new Concentration.ComputerPlayer(this.$cards, 20, 2, this.board);
    }
  };

  Game.prototype.initHud = function ($hud) {
    this.hud = new Concentration.Hud($hud);
  };

  Game.prototype.start = function () {
    this.turn = new Concentration.Turn(this.board, this.player1, this.player2);
    this.play()
    .done(function () {
      var msg = this.gameEndMessage();
      this.hud.announceWinner(msg);
    }.bind(this));
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
      if (game.isOver()) return gameOver.resolve();

      game.deferTo(currentPlayer)
      .then(function (nextOrSamePlayer) {
        _prompt(nextOrSamePlayer);
      })
      .fail(function (err) {
        gameOver.reject(err);
      });
    }
  };

  Game.prototype.deferTo = function (player) {
    var turnTaken = Q.defer(), game = this;

    player.getInput()
    .then(function ($card) {
      return game.turn.handleChoice(player, $card);
    })
    .then(function (nextOrSamePlayer) {
      var numCards = game.board.numCards;

      game.hud.render(numCards, nextOrSamePlayer);
      turnTaken.resolve(nextOrSamePlayer);
    })
    .fail(function (err) {
      turnTaken.reject(err);
    });

    return turnTaken.promise;
  };

  Game.prototype.isOver = function () {
    return !this.board.numCards;
  };
})();

