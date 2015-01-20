(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};

  // Superclass of ComputerPlayer and HumanPlayer
  var Player = Concentration.Player = function (id, board) {
    this.id = id;
    this.board = board;
    this.numMatches = 0;
  };

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
})();


(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};

  var Board = Concentration.Board = function ($el, graveyard1, graveyard2) {
    this.$el = $el;
    this.graveyard1 = graveyard1;
    this.graveyard2 = graveyard2;
    this.deck = new Concentration.Deck().shuffle();
    this.numCards = this.deck.count();
  };

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

  Board.prototype.show = function ($card) {
    $card.trigger('showing');
    $card.removeClass('hidden');
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
    $cards.forEach(function ($card) {
      $card.addClass('removed');
      $card.trigger('matched');
    });
  };
})();


(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};
  var Card = Concentration.Card = function (suit, number) {
    this.suit = suit;
    this.number = number;
  };

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
})();


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


$(function () {
  new Concentration.Game().start();
});


(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};

  var Deck = Concentration.Deck = function () {
    this.cards = [];
    this.loadCards();
  };

  Deck.prototype.loadCards = function () {
    var cards = this.cards;

    for (var suit in Concentration.Card.SUIT_SYMBOLS) {
      for (var number in Concentration.Card.NUMBER_SYMBOLS) {
        var thisCard = new Concentration.Card(suit, number);

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
})();


(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};
  
  var Game = Concentration.Game = function () {
    this.board = null;
    this.initBoard();

    this.player1 = null;
    this.player2 = null;
    this.initPlayers();

    this.turn = new Concentration.Turn(this.board, this.player1, this.player2);
    this.hud = null;
    this.initHud();
  };

  Game.prototype.initBoard = function () {
    var $boardEl = $('.board'),
        $graveyard1El = $('.graveyard#one'),
        $graveyard2El = $('.graveyard#two'),
        graveyard1 = new Concentration.Graveyard($graveyard1El);
        graveyard2 = new Concentration.Graveyard($graveyard2El);

    this.board = new Concentration.Board($boardEl, graveyard1, graveyard2);
    this.board.layCards();
  };

  Game.prototype.initPlayers = function () {
    var $cards = $('.card');

    this.player1 = new Concentration.HumanPlayer(1, this.board);
    //this.player2 = new Concentration.HumanPlayer(2, this.board);
    //this.player1 = new Concentration.ComputerPlayer($cards, 20, 1, this.board);
    this.player2 = new Concentration.ComputerPlayer($cards, 20, 2, this.board);
  };

  Game.prototype.initHud = function () {
    var $hud = $('.hud');

    this.hud = new Concentration.Hud($hud, this.player1, this.player2);
    this.hud.render(this.board.numCards);
  };

  Game.prototype.start = function () {
    this.play()
        .then(function () {
          var msg = this.gameEndMessage();
          this.hud.announceWinner(msg);
        }.bind(this))
        .fail(function (err) { throw err; });
  };

  Game.prototype.gameEndMessage = function () {
      var player1Score = this.player1.numMatches,
          player2Score = this.player2.numMatches;

      if (player1Score > player2Score) {
        return "Player 1 wins";
      } else if (player2Score > player1Score) {
        return "Player 2 wins";
      } else {
        return "Draw";
      }
  };

  Game.prototype.play = function () {
    var game = this,
        gameOver = Q.defer();

    _prompt(this.player1);

    return gameOver.promise;

    function _prompt(currentPlayer) {
      if (game.endCondition()) return gameOver.resolve();

      game.defer_to(currentPlayer)
      .then(function (nextOrSamePlayer) {
        _prompt(nextOrSamePlayer);
      })
      .fail(function (err) { throw err; });
    }
  };

  Game.prototype.defer_to = function (player) {
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

  Game.prototype.endCondition = function () {
    return !this.board.numCards;
  };
})();


(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};

  var Graveyard = Concentration.Graveyard = function ($el) {
    this.$el = $el;
  };

  Graveyard.prototype.add = function (cardTags) {
    var $graveyard = this.$el;

    cardTags.forEach(function (cardTag) {
      var tagClone = cardTag.clone();
      $graveyard.append(tagClone);
    });
  };
})();


(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};

  var Hud = Concentration.Hud = function ($el, player1, player2) {
    this.$el = $el;
    this.player1 = player1;
    this.player2 = player2;
  };

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

  Hud.prototype.announceWinner = function (msg) {
    var $span = $('<span>');
    $span.html(msg);

    this.$el.html($span);
  };
})();


(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};

  // Inherits from Player class
  var HumanPlayer = Concentration.HumanPlayer = function (args) {
    Concentration.Player.apply(this, arguments);
  };

  // Not ideal because Player class must be declared first.
  // Can't wait for doc ready either lest HumanPlayer proto gets overriden
  // Investigate more flexible inheritance
  HumanPlayer.prototype = Object.create(Concentration.Player.prototype);
  HumanPlayer.prototype.constructor = HumanPlayer;

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
})();


(function () {
   if (typeof Concentration === "undefined") window.Concentration = {};

  var Inspector = Concentration.Inspector = function (board) {
    this.board = board;
    this.flippedCards = [];
  };

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
})();


(function () {
  if (typeof Concentration === "undefined") window.Concentration = {};

  var Turn = Concentration.Turn = function (board, player1, player2) {
    this.board = board;
    this.inspector = new Concentration.Inspector(this.board);
    this.player1 = player1;
    this.player2 = player2;
  };

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
})();


/**
 * A doubly linked list-based Least Recently Used (LRU) cache. Will keep most
 * recently used items while discarding least recently used items when its limit
 * is reached.
 *
 * Licensed under MIT. Copyright (c) 2010 Rasmus Andersson <http://hunch.se/>
 * See README.md for details.
 *
 * Illustration of the design:
 *
 *       entry             entry             entry             entry
 *       ______            ______            ______            ______
 *      | head |.newer => |      |.newer => |      |.newer => | tail |
 *      |  A   |          |  B   |          |  C   |          |  D   |
 *      |______| <= older.|______| <= older.|______| <= older.|______|
 *
 *  removed  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  added
 */
function LRUCache (limit) {
  // Current size of the cache. (Read-only).
  this.size = 0;
  // Maximum number of items this cache can hold.
  this.limit = limit;
  this._keymap = {};
}

/**
 * Put <value> into the cache associated with <key>. Returns the entry which was
 * removed to make room for the new entry. Otherwise undefined is returned
 * (i.e. if there was enough room already).
 */
LRUCache.prototype.put = function(key, value) {
  var entry = {key:key, value:value};
  // Note: No protection agains replacing, and thus orphan entries. By design.
  this._keymap[key] = entry;
  if (this.tail) {
    // link previous tail to the new tail (entry)
    this.tail.newer = entry;
    entry.older = this.tail;
  } else {
    // we're first in -- yay
    this.head = entry;
  }
  // add new entry to the end of the linked list -- it's now the freshest entry.
  this.tail = entry;
  if (this.size === this.limit) {
    // we hit the limit -- remove the head
    return this.shift();
  } else {
    // increase the size counter
    this.size++;
  }
};

/**
 * Purge the least recently used (oldest) entry from the cache. Returns the
 * removed entry or undefined if the cache was empty.
 *
 * If you need to perform any form of finalization of purged items, this is a
 * good place to do it. Simply override/replace this function:
 *
 *   var c = new LRUCache(123);
 *   c.shift = function() {
 *     var entry = LRUCache.prototype.shift.call(this);
 *     doSomethingWith(entry);
 *     return entry;
 *   }
 */
LRUCache.prototype.shift = function() {
  // todo: handle special case when limit == 1
  var entry = this.head;
  if (entry) {
    if (this.head.newer) {
      this.head = this.head.newer;
      this.head.older = undefined;
    } else {
      this.head = undefined;
    }
    // Remove last strong reference to <entry> and remove links from the purged
    // entry being returned:
    entry.newer = entry.older = undefined;
    // delete is slow, but we need to do this to avoid uncontrollable growth:
    delete this._keymap[entry.key];
  }
  return entry;
};

/**
 * Get and register recent use of <key>. Returns the value associated with <key>
 * or undefined if not in cache.
 */
LRUCache.prototype.get = function(key, returnEntry) {
  // First, find our cache entry
  var entry = this._keymap[key];
  if (entry === undefined) return; // Not cached. Sorry.
  // As <key> was found in the cache, register it as being requested recently
  if (entry === this.tail) {
    // Already the most recenlty used entry, so no need to update the list
    return returnEntry ? entry : entry.value;
  }
  // HEAD--------------TAIL
  //   <.older   .newer>
  //  <--- add direction --
  //   A  B  C  <D>  E
  if (entry.newer) {
    if (entry === this.head)
      this.head = entry.newer;
    entry.newer.older = entry.older; // C <-- E.
  }
  if (entry.older)
    entry.older.newer = entry.newer; // C. --> E
  entry.newer = undefined; // D --x
  entry.older = this.tail; // D. --> E
  if (this.tail)
    this.tail.newer = entry; // E. <-- D
  this.tail = entry;
  return returnEntry ? entry : entry.value;
};

// ----------------------------------------------------------------------------
// Following code is optional and can be removed without breaking the core
// functionality.

/**
 * Check if <key> is in the cache without registering recent use. Feasible if
 * you do not want to chage the state of the cache, but only "peek" at it.
 * Returns the entry associated with <key> if found, or undefined if not found.
 */
LRUCache.prototype.find = function(key) {
  return this._keymap[key];
};

/**
 * Update the value of entry with <key>. Returns the old value, or undefined if
 * entry was not in the cache.
 */
LRUCache.prototype.set = function(key, value) {
  var oldvalue, entry = this.get(key, true);
  if (entry) {
    oldvalue = entry.value;
    entry.value = value;
  } else {
    oldvalue = this.put(key, value);
    if (oldvalue) oldvalue = oldvalue.value;
  }
  return oldvalue;
};

/**
 * Remove entry <key> from cache and return its value. Returns undefined if not
 * found.
 */
LRUCache.prototype.remove = function(key) {
  var entry = this._keymap[key];
  if (!entry) return;
  delete this._keymap[entry.key]; // need to do delete unfortunately
  if (entry.newer && entry.older) {
    // relink the older entry with the newer entry
    entry.older.newer = entry.newer;
    entry.newer.older = entry.older;
  } else if (entry.newer) {
    // remove the link to us
    entry.newer.older = undefined;
    // link the newer entry to head
    this.head = entry.newer;
  } else if (entry.older) {
    // remove the link to us
    entry.older.newer = undefined;
    // link the newer entry to head
    this.tail = entry.older;
  } else {// if(entry.older === undefined && entry.newer === undefined) {
    this.head = this.tail = undefined;
  }

  this.size--;
  return entry.value;
};

/** Removes all entries */
LRUCache.prototype.removeAll = function() {
  // This should be safe, as we never expose strong refrences to the outside
  this.head = this.tail = undefined;
  this.size = 0;
  this._keymap = {};
};

/**
 * Return an array containing all keys of entries stored in the cache object, in
 * arbitrary order.
 */
if (typeof Object.keys === 'function') {
  LRUCache.prototype.keys = function() { return Object.keys(this._keymap); };
} else {
  LRUCache.prototype.keys = function() {
    var keys = [];
    for (var k in this._keymap) keys.push(k);
    return keys;
  };
}

/**
 * Call `fun` for each entry. Starting with the newest entry if `desc` is a true
 * value, otherwise starts with the oldest (head) enrty and moves towards the
 * tail.
 *
 * `fun` is called with 3 arguments in the context `context`:
 *   `fun.call(context, Object key, Object value, LRUCache self)`
 */
LRUCache.prototype.forEach = function(fun, context, desc) {
  var entry;
  if (context === true) { desc = true; context = undefined; }
  else if (typeof context !== 'object') context = this;
  if (desc) {
    entry = this.tail;
    while (entry) {
      fun.call(context, entry.key, entry.value, this);
      entry = entry.older;
    }
  } else {
    entry = this.head;
    while (entry) {
      fun.call(context, entry.key, entry.value, this);
      entry = entry.newer;
    }
  }
};

/** Returns a JSON (array) representation */
LRUCache.prototype.toJSON = function() {
  var s = [], entry = this.head;
  while (entry) {
    s.push({key:entry.key.toJSON(), value:entry.value.toJSON()});
    entry = entry.newer;
  }
  return s;
};

/** Returns a String representation */
LRUCache.prototype.toString = function() {
  var s = '', entry = this.head;
  while (entry) {
    s += String(entry.key)+':'+entry.value;
    entry = entry.newer;
    if (entry)
      s += ' < ';
  }
  return s;
};

// Export ourselves
if (typeof this === 'object') this.LRUCache = LRUCache;
//# sourceMappingURL=concentration.all.js.map