function ComputerPlayer ($cards, args) {
  Player.apply(this, [].slice.call(arguments, 1));
  this.$cards = $cards;
  this.memory = new LRUCache(5);
  this.watchCards();
}

ComputerPlayer.prototype = Object.create(Player.prototype);
ComputerPlayer.prototype.constructor = ComputerPlayer;

ComputerPlayer.prototype.getInput = function () {
  var chose = Q.defer(),
      $availableCards = this.$cards.filter('.hidden');
      // Just pick a random, non-hidden card for now
      chosenCard = $availableCards[Math.floor(Math.random() *
          $availableCards.length)];

  setTimeout(function () {
    chose.resolve($(chosenCard));
  }, this.constructor.THINK_TIME);

  return chose.promise;
};

ComputerPlayer.prototype.confirmNextTurn = function () {
  var confirmed = Q.defer();

  setTimeout(function () {
    confirmed.resolve();
  }, this.constructor.THINK_TIME);

  return confirmed.promise;
};

ComputerPlayer.prototype.watchCards = function () {
  this.$cards.on('showing', function (evnt) {
    var $card = $(evnt.target),
        cardNumber = $card.data('number');

    this.memory.put($card, cardNumber);
  }.bind(this));
};

ComputerPlayer.THINK_TIME = 1000;

