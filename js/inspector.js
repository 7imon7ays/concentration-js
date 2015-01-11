function Inspector ($boardEl) {
  this.$boardEl = $boardEl;
  this.flipCardsOnClick();
}

Inspector.prototype.flipCardsOnClick = function () {
  var flippedCards = this.flippedCards;
  this.$boardEl.on('click', function (event) {
    var $card = $(event.target);
    $card.removeClass('hidden');
  });
};

