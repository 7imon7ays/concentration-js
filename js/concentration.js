function Concentration () {
  var $graveyardEl = $('.graveyard'),
      graveyard = new Graveyard($graveyardEl);
  this.$boardEl = $('.board');
  this.board = new Board(this.$boardEl, graveyard);
  this.inspector = new Inspector(this.board);
}

Concentration.prototype.start = function () {
  this.board.layCards();
  this.inspector.flipOrHideCardsOnClick();
};

new Concentration().start();

