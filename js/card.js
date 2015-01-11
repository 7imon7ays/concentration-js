function Card (suit, number) {
  this.suit = suit;
  this.number = number;
}

Card.prototype.htmlTag = function () {
  var $div = $('<div>'), suit = this.suit, num = this.number;

  $div.addClass('card');

  if (suit == "&hearts;" || suit == "&diams;") {
    $div.addClass('red');
  }

  $div.append(suit)
      .append(num);
  return $div[0];
};


