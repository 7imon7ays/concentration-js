function Concentration () {
  var $graveyardEl = $('.graveyard'),
      graveyard = new Graveyard($graveyardEl);
  this.$boardEl = $('.board');
  this.board = new Board(this.$boardEl, graveyard);
  this.player1 = new Player(this.board);
}

Concentration.prototype.start = function () {
  this.board.layCards();
  this.player1.takeTurn();
};

new Concentration().start();

