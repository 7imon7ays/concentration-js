function Turn (board, player1, player2) {
  this.board = board;
  this.inspector = new Inspector(this.board);
  this.player1 = player1;
  this.player2 = player2;
}

Turn.prototype.handleChoice = function (player, $chosenCard) {
  var choiceHandled = Q.defer(),
      currentPlayer = (player == this.player1 ? this.player1 : this.player2),
      nextPlayer = (player == this.player1 ? this.player2 : this.player1),

      turnOutcome = this.inspector.evaluateChoice($chosenCard);

  switch(turnOutcome) {
    case "continue":
      // Player keeps going if the max number of cards
      // hasn't been flipped
      choiceHandled.resolve(currentPlayer);
      break;
    case "match":
      currentPlayer.confirmNextTurn()
      .then(function () {
        this.inspector.removeMatches(currentPlayer);
        choiceHandled.resolve(currentPlayer);
      }.bind(this))
      .fail(function (err) { throw err; });
      break;
    case "miss":
      currentPlayer.confirmNextTurn()
      .then(function () {
        this.inspector.hideCards();
        choiceHandled.resolve(nextPlayer);
      }.bind(this))
      .fail(function (err) { throw err; });
      break;
    default:
      throw new Error("Unknown choice outcome");
  }

  return choiceHandled.promise;
};

