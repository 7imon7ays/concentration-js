function Concentration () {
 this.$content = $('.content');
 this.board = new Board(this.$content);
 this.inspector = new Inspector(this.board);
}

Concentration.prototype.start = function () {
  this.board.layCards();
  this.inspector.flipCardsOnClick();
};

new Concentration().start();

