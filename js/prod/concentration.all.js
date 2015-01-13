function Board($el, graveyard) {
  this.$el = $el;
  this.graveyard = graveyard;
  this.deck = new Deck().shuffle();
  this.numCards = this.deck.count();
}

Board.prototype.render = function (content) {
  this.$el.html(content);
};

Board.prototype.buildCardTags = function () {
  return this.deck.cards.map(function (card) {
    return card.htmlTag();
  });
};

Board.prototype.layCards = function () {
  var cardTags = this.buildCardTags();

  this.render(cardTags);
};

Board.prototype.show = function (cardTag) {
  cardTag.removeClass('hidden');
};

Board.prototype.hide = function (cardTag) {
  cardTag.addClass('hidden');
};

Board.prototype.on = function (evnt, callback) {
  this.$el.on(evnt, callback);
};

Board.prototype.off = function (evnt) {
  this.$el.off(evnt);
};

Board.prototype.remove = function (cardTags) {
  this.graveyard.add(cardTags);
  this.numCards -= cardTags.length;
  cardTags.forEach(function (cardTag) {
    cardTag.addClass('removed');
  });
};


function Card (suit, number) {
  this.suit = suit;
  this.number = number;
}

Card.prototype.spanTag = function () {
  return $('<span>').append(this.suitSyms(this.suit))
                    .append(this.numSyms(this.number));
};

Card.prototype.divTag = function () {
  var $div = $('<div>');
  $div.addClass(this.constructor.htmlClass)
      .addClass('hidden');

  if (this.suit == "hearts" || this.suit == "diamonds") {
    $div.addClass('red');
  }

  $div.data('number', this.number);

  return $div;
};

Card.prototype.htmlTag = function () {
  var spanTag = this.spanTag(),
      divTag = this.divTag();

  divTag.append(spanTag);

  return divTag[0];
};

Card.htmlClass = 'card';

Card.prototype.suitSyms = function (suit) {
  return this.constructor.SUIT_SYMBOLS[suit];
};

Card.prototype.numSyms = function (num) {
  return this.constructor.NUMBER_SYMBOLS[num];
};

Card.SUIT_SYMBOLS = {
  clubs:    "&clubs;",
  diamonds: "&diams;",
  hearts:   "&hearts;",
  spades:   "&spades;"
};

Card.NUMBER_SYMBOLS = {
  two:   "2",
  three: "3",
};

/*
  four:  "4",
  five:  "5",
  six:   "6",
  seven: "7",
  eight: "8",
  nine:  "9",
  ten:   "10",
  jack:  "J",
  queen: "Q",
  king : "K",
  ace  : "A"
  */

function Concentration () {
  var $graveyardEl = $('.graveyard'),
      graveyard = new Graveyard($graveyardEl);

  this.$boardEl = $('.board');
  this.board = new Board(this.$boardEl, graveyard);
  this.inspector = new Inspector(this.board);
  this.player1 = new Player(1, this.board);
  this.player2 = new Player(2, this.board);
}

Concentration.prototype.start = function () {
  this.board.layCards();
  this.play();
};

Concentration.prototype.play = function () {
  var game = this;
  var gameOver = Q.defer();

  _invite(this.player1);

  function _invite(currentPlayer) {
    console.log('Waiting on: Player', currentPlayer.id);
    if (game.endCondition()) return gameOver.resolve();

    game.turn(currentPlayer)
    .then(function (nextPlayer) {
      _invite(nextPlayer);
    })
    .fail(function (error) {
      game.notice(error);
    });
  }

  return gameOver.promise;
};

Concentration.prototype.turn = function (player) {
  var game = this, madeMove = Q.defer(),
      currentPlayer = (player == this.player1 ? this.player1 : this.player2),
      nextPlayer = (player == this.player1 ? this.player2 : this.player1);

  currentPlayer.takeTurn()
  .then(function ($chosenCard) {
    var turnOutcome = game.inspector.handleChoice($chosenCard);

    switch(turnOutcome) {
      case "continue":
        // Player keeps going if the max number of cards
        // hasn't been flipped
        madeMove.resolve(currentPlayer);
        break;
      case "match":
        currentPlayer.confirmNextTurn()
        .then(function () {
          game.inspector.removeMatches();
          madeMove.resolve(currentPlayer);
        })
        .fail(function (err) { console.log(err); });
        break;
      case "fail":
        currentPlayer.confirmNextTurn()
        .then(function () {
          game.inspector.hideCards();
          madeMove.resolve(nextPlayer);
        })
        .fail(function (err) { console.log(err); });
        break;
      default:
        throw new Error("Unknown choice outcome");
    }
  })
  .fail(function (error) {
    game.notice(error);
  });

  return madeMove.promise;
};

Concentration.prototype.endCondition = function () {
  // Game never ends for now
  return false;
};

Concentration.prototype.notice = function (msg) {
  console.log(msg);
};

$(function () {
  new Concentration().start();
});


function Deck () {
  this.cards = [];
  this.loadCards();
}

Deck.prototype.loadCards = function () {
  var cards = this.cards;

  for (var suit in Card.SUIT_SYMBOLS) {
    for (var number in Card.NUMBER_SYMBOLS) {
      var thisCard = new Card(suit, number);

      cards.push(thisCard);
    }
  }
};

Deck.prototype.count = function () {
  return this.cards.length;
};

Deck.prototype.shuffle = function () {
 /*
  * As seen on stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  */
  var currentIndex = this.cards.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = this.cards[currentIndex];
    this.cards[currentIndex] = this.cards[randomIndex];
    this.cards[randomIndex] = temporaryValue;
  }

  return this;
};


function Graveyard ($el) {
  this.$el = $el;
}

Graveyard.prototype.add = function (cardTags) {
  var $graveyard = this.$el;

  cardTags.forEach(function (cardTag) {
    var tagClone = cardTag.clone();
    $graveyard.append(tagClone);
  });
};


function Inspector (board) {
  this.board = board;
  this.flippedCards = [];
}

Inspector.prototype.handleChoice = function ($card) {
  var outcome = "continue";

  this.flippedCards.push($card);
  this.inspect($card);
  if (this.isShowingMax()) {
    outcome = this.compareCards();
  }

  return outcome;
};

Inspector.prototype.compareCards = function () {
  if (_cardsHaveSameNumber(this.flippedCards)) {
    // Flush out flipped cards by setting length to 0
    return "match";
  } else {
    return "fail";
  }

  // Reduce cards to 'false' unless they all have the same number
  function _cardsHaveSameNumber (cards) {
    return !!cards.reduce(function (prevCard, card) {
      if (prevCard.data && prevCard.data('number') == card.data('number')) {
        return card;
      }

      return false;
    });
  }
};

Inspector.prototype.inspect = function ($card) {
  this.board.show($card);
};

Inspector.prototype.isShowingMax = function () {
  return this.flippedCards.length >= this.constructor.MAX_MATCHES;
};

Inspector.prototype.removeMatches = function () {
  this.board.remove(this.flippedCards);
  this.flush();
};

Inspector.prototype.hideCards = function () {
  this.flippedCards.forEach(function($card) {
    this.board.hide($card);
  }.bind(this));

  this.flush();
};

Inspector.prototype.flush = function () {
  this.flippedCards.length = 0;
};

Inspector.MAX_MATCHES = 2;


function Player (id, board) {
  this.id = id;
  this.board = board;
}

Player.prototype.takeTurn = function () {
  var turnTaken = Q.defer();

  this.getInput()
  .then(function ($card) {
    turnTaken.resolve($card);
  });

  return turnTaken.promise;
};

Player.prototype.getInput = function () {
  var clicked = Q.defer();
  this.board.on('click', function (evnt) {
    var $card = $(evnt.target);

    // Ignore click if player didn't click a card
    // Or clicked a revealed card
    if (!$card.hasClass('card') || !$card.hasClass('hidden')) return;

    this.board.off('click');
    clicked.resolve($card);
  }.bind(this));

  return clicked.promise;
};

Player.prototype.confirmNextTurn = function () {
  var $window = $(window), clicked = Q.defer();

  $window.on('click', function () {
    clicked.resolve();
    $window.off('click');
  });

  return clicked.promise;
};


//# sourceMappingURL=concentration.all.js.map