(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};

  var Hud = Concentration.Hud = function ($el) {
    this.$el = $el;
    this.player1 = null;
    this.player2 = null;
  };

  Hud.prototype.setPlayers = function (player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
  };

  Hud.prototype.render = function (numCards, currentPlayer) {
    var $remainingCardsSpan = this.remainingCardsSpan(numCards),
        $player1span = this.playerSpan(this.player1),
        $player2span = this.playerSpan(this.player2);

    if (currentPlayer) {
      var $currentPlayerSpan = (currentPlayer == this.player1 ? $player1span : $player2span);
      $currentPlayerSpan.addClass('active');
    }

    this.$el.html($remainingCardsSpan)
            .append($player1span)
            .append($player2span);
  };

  Hud.prototype.playerSpan = function (player) {
    var $span = $('<span>'),
        content = "Player " + player.id + " Matches: "  + player.numMatches;

    $span.addClass("player " + this.constructor.playerIds[player.id])
         .html(content);

    return $span;
  };

  Hud.prototype.remainingCardsSpan = function (numCards) {
    return $('<span>').append('Cards remaining: ' + numCards);
  };

  Hud.prototype.announceWinner = function (msg) {
    var $span = $('<span>');
    $span.html(msg);

    this.$el.html($span);
  };

  Hud.playerIds = {
    1: 'one',
    2: 'two'
  };
})();

