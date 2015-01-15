function Board($el, graveyard1, graveyard2) {
  this.$el = $el;
  this.graveyard1 = graveyard1;
  this.graveyard2 = graveyard2;
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

Board.prototype.remove = function ($cards, player) {
  var graveyard = (player.id == 1 ? this.graveyard1 : this.graveyard2);

  graveyard.add($cards);
  this.numCards -= $cards.length;
  $cards.forEach(function ($cardTags) {
    $cardTags.addClass('removed');
  });
};


function Card (suit, number) {
  this.suit = suit;
  this.number = number;
}

Card.prototype.span = function () {
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
  var $span = this.span(),
      divTag = this.divTag();

  divTag.append($span);

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
};


function ComputerPlayer ($cards, args) {
  Player.apply(this, [].slice.call(arguments, 1));
  this.$cards = $cards;
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

ComputerPlayer.THINK_TIME = 1000;


function Concentration () {
  this.board = null;
  this.initBoard();

  this.player1 = null;
  this.player2 = null;
  this.initPlayers();

  this.turn = new Turn(this.board, this.player1, this.player2);
  this.hud = null;
  this.initHud();
}

Concentration.prototype.initBoard = function () {
  var $boardEl = $('.board'),
      $graveyard1El = $('.graveyard#one'),
      $graveyard2El = $('.graveyard#two'),
      graveyard1 = new Graveyard($graveyard1El);
      graveyard2 = new Graveyard($graveyard2El);

  this.board = new Board($boardEl, graveyard1, graveyard2);
  this.board.layCards();
};

Concentration.prototype.initPlayers = function () {
  var $cards = $('.card');

  this.player1 = new HumanPlayer(1, this.board);
  this.player2 = new ComputerPlayer($cards, 2, this.board);
  //this.player2 = new HumanPlayer(2, this.board);
};

Concentration.prototype.initHud = function () {
  var $hud = $('.hud');

  this.hud = new Hud($hud, this.player1, this.player2);
  this.hud.render(this.board.numCards);
};

Concentration.prototype.play = function () {
  var game = this,
      gameOver = Q.defer();

  _prompt(this.player1);

  return gameOver.promise;

  function _prompt(currentPlayer) {
    game.notice('Waiting on: Player ' + currentPlayer.id);

    if (game.endCondition()) return gameOver.resolve();

    game.defer_to(currentPlayer)
    .then(function (nextOrSamePlayer) {
      _prompt(nextOrSamePlayer);
    })
    .fail(function (err) { throw err; });
  }
};

Concentration.prototype.defer_to = function (player) {
  var turnTaken = Q.defer(), game = this;

  player.takeTurn()
  .then(function ($card) {
    return game.turn.handleChoice(player, $card);
  })
  .then(function (nextOrSamePlayer) {
    var numCards = game.board.numCards;

    game.hud.render(numCards, nextOrSamePlayer);
    turnTaken.resolve(nextOrSamePlayer);
  })
  .fail(function (err) { throw err; });

  return turnTaken.promise;
};

Concentration.prototype.endCondition = function () {
  // Game never ends for now
  return false;
};

Concentration.prototype.notice = function (msg) {
  console.log(msg);
};


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


function Hud ($el, player1, player2) {
  this.$el = $el;
  this.player1 = player1;
  this.player2 = player2;
}

Hud.prototype.render = function (numCards, currentPlayer) {
  var $remainingCardsSpan = this.remainingCardsSpan(numCards),
      $player1span = this.playerSpan(this.player1),
      $player2span = this.playerSpan(this.player2);

  if (currentPlayer) {
    var $currentPlayerSpan = (currentPlayer == this.player1 ? $player1span : $player2span);
    $currentPlayerSpan.addClass('active');
  }

  this.$el.html($remainingCardsSpan)
          .append($player1span)
          .append($player2span);
};

Hud.prototype.playerSpan = function (player) {
  var $span = $('<span>'),
      content = "Player " + player.id + " Matches: "  + player.numMatches;

  $span.addClass("player" + player.id)
       .html(content);

  return $span;
};

Hud.prototype.remainingCardsSpan = function (numCards) {
  return $('<span>').append('Cards remaining: ' + numCards);
};


// Inherits from Player class
function HumanPlayer(args) {
  Player.apply(this, arguments);
}

HumanPlayer.prototype = Object.create(Player.prototype);
HumanPlayer.prototype.constructor = Player;

HumanPlayer.prototype.getInput = function () {
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

HumanPlayer.prototype.confirmNextTurn = function () {
  var $window = $(window), clicked = Q.defer();

  $window.on('click', function () {
    clicked.resolve();
    $window.off('click');
  });

  return clicked.promise;
};


function Inspector (board) {
  this.board = board;
  this.flippedCards = [];
}

Inspector.prototype.evaluateChoice = function ($card) {
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
    return "miss";
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

Inspector.prototype.removeMatches = function (player) {
  this.board.remove(this.flippedCards, player);
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


$(function () {
  new Concentration().play();
});


// Superclass of ComputerPlayer and HumanPlayer

function Player (id, board) {
  this.id = id;
  this.board = board;
  this.numMatches = 0;
}

Player.prototype.takeTurn = function () {
  var turnTaken = Q.defer();

  this.getInput()
  .then(function ($card) {
    turnTaken.resolve($card);
  })
  .fail(function (err) {
    throw err;
  });

  return turnTaken.promise;
};

Player.prototype.recordNewMatch = function () {
  this.numMatches++;
};


function Turn (board, player1, player2) {
  this.board = board;
  this.inspector = new Inspector(this.board);
  this.player1 = player1;
  this.player2 = player2;
}

Turn.prototype.handleChoice = function (player, $chosenCard) {
  var choiceHandled = Q.defer(),
      currentPlayer = (player == this.player1 ? this.player1 : this.player2),
      nextPlayer = (player == this.player1 ? this.player2 : this.player1),

      turnOutcome = this.inspector.evaluateChoice($chosenCard);

  switch(turnOutcome) {
    case "continue":
      // Player keeps going if the max number of cards
      // hasn't been flipped
      choiceHandled.resolve(currentPlayer);
      break;
    case "match":
      currentPlayer.confirmNextTurn()
      .then(function () {
        currentPlayer.recordNewMatch();
        this.inspector.removeMatches(currentPlayer);
        choiceHandled.resolve(currentPlayer);
      }.bind(this))
      .fail(function (err) { throw err; });
      break;
    case "miss":
      currentPlayer.confirmNextTurn()
      .then(function () {
        this.inspector.hideCards();
        choiceHandled.resolve(nextPlayer);
      }.bind(this))
      .fail(function (err) { throw err; });
      break;
    default:
      throw new Error("Unknown choice outcome");
  }

  return choiceHandled.promise;
};


//# sourceMappingURL=concentration.all.js.map