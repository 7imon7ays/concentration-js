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
    var chose = Q.defer(), chosenCard = this.findMatchInMemory();

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
          cardNumber = $(card).data('number'),
          sameNumberCards = this.memory.find(cardNumber);

      if (!sameNumberCards) {
        this.memory.put(cardNumber, [card]);
      } else if (sameNumberCards.value.indexOf(card) === -1) {
        sameNumberCards.value.push(card);
      } else {
        // If the card was already seen,
        // move it to the top of the cache
        this.memory.get(cardNumber);
      }

    }.bind(this));

    this.$cards.on('matched', function (evnt) {
      var card = evnt.target,
          cardNumber = $(card).data('number'),
          removedCardsArray = this.memory
                                  .find(cardNumber).value
                                  .filter(function (c) {
                                    return c !== card;
                                  });

      this.memory.set(cardNumber, removedCardsArray);
    }.bind(this));
  };

  ComputerPlayer.prototype.findMatchInMemory = function () {
    var seenNumbers = this.memory.keys(), sameNumberCards, i;

    for (i = 0; i < seenNumbers.length; i++) {
      sameNumberCards = this.memory.find(seenNumbers[i]).value;
      if (sameNumberCards.length > 1) {
        // Ignore the card currently showing on the board
        return $(sameNumberCards[0]).hasClass('hidden') ?
          sameNumberCards[0] : sameNumberCards[1];
      }
    }

    return null;
  };

  ComputerPlayer.THINK_TIME = 1000;
})();

