function Concentration($el) {
  this.render = function (content) {
    $el.html(content);
  };
  this.deck = new Deck();
}

Concentration.prototype.layCards = function () {
  var cardsString = this.deck.cards.map(function (c) {
    return "<div class='card'>" + c[0] + ' ' + c[1] + "</div>";
  }).join('');

  this.render(cardsString);
};

var concentration = new Concentration($('.content'));

concentration.layCards();

