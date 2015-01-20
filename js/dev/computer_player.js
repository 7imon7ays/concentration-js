(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};

  var ComputerPlayer = Concentration.ComputerPlayer = function ($cards, memoryLimit, args) {
    Concentration.Player.apply(this, [].slice.call(arguments, 2));
    this.$cards = $cards;
    this.memory = new LRUCache(memoryLimit);
    this.watchCards();
  };

  // Same inheritance problem as with HumanPlayer
  ComputerPlayer.prototype = Object.create(Concentration.Player.prototype);
  ComputerPlayer.prototype.constructor = ComputerPlayer;

  ComputerPlayer.prototype.getInput = function () {
    var chose = Q.defer(), chosenCard;

    chosenCard = this.findMatchInMemory();

    if (!chosenCard) {
      // Pick a random, non-hidden card if no matches found
      var  $availableCards = this.$cards.filter('.hidden');
      chosenCard = $availableCards[Math.floor(Math.random() * $availableCards.length)];
    }

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
      var card = evnt.target,
          cardNumber = $(card).data('number');

      // For some reason removed cards still
      // appear in the matching loop
      this.memory.put(card, cardNumber);
    }.bind(this));

    this.$cards.on('matched', function (evnt) {
      var card = evnt.target;

      this.memory.remove(card);
    }.bind(this));
  };

  ComputerPlayer.prototype.findMatchInMemory = function () {
    var seenCards = {}, foundCard;
    this.memory.forEach(function (card, number) {
      // Dirty fix to removal problem:
      // Skip cards here that are already removed
      if ($(card).hasClass('removed')) {
      } else if (seenCards[number] && seenCards[number] != card) {
        var hiddenCard = ($(card).hasClass('hidden') ? card : seenCards[number]);
        foundCard = hiddenCard;
      } else {
        seenCards[number] = card;
      }
    });

    return foundCard;
  };

  ComputerPlayer.THINK_TIME = 1000;
})();

