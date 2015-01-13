function Player (board) {
  this.board = board;
  this.inspector = new Inspector(board);
}

Player.prototype.takeTurn = function () {
  this.listenForInput();
};

Player.prototype.pick = function ($card) {
  if (!$card.hasClass('hidden')) return;
  this.inspector.inspect($card);
};

Player.prototype.listenForInput = function () {
  this.board.on('click', function (evnt) {
    var $card = $(evnt.target);

    if (this.inspector.isShowingMax()) {
      this.inspector.compareCards();
    } else {
      if (!$card.hasClass('card')) return;
      this.pick($card);
    }
  }.bind(this));
};

