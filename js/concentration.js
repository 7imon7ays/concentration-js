function Concentration () {
  var $graveyardEl = $('.graveyard'),
      graveyard = new Graveyard($graveyardEl);
  this.$boardEl = $('.board');
  this.board = new Board(this.$boardEl, graveyard);
  this.player = new Player(this.board);
}

Concentration.prototype.start = function () {
  this.board.layCards();
  this.player.listenForInput();
};

new Concentration().start();

