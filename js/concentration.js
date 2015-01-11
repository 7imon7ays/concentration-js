function Concentration($el) {
  this.$el = $el;
}

Concentration.prototype.render = function () {
  this.$el.html('cards go here');
};

var concentration = new Concentration($('.content'));

