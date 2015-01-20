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

