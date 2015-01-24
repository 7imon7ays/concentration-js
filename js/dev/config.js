(function () {
  if (typeof Concentration == "undefined") window.Concentration = {};

  var Config = Concentration.Config = function ($playerTypeButtons, $player1TypeButton, $player2TypeButton) {
    this.$playerTypeButtons = $playerTypeButtons;
    this.$player1TypeButton = $player1TypeButton;
    this.$player2TypeButton = $player2TypeButton;
  };

  Config.prototype.listenForGameConfig = function ($playerTypeButtons) {
    this.$playerTypeButtons.on('click', function (evnt) {
      var $button = $(evnt.target);

      $button.toggleClass('human')
             .toggleClass('computer');

      var isHuman = $button.data('ishuman');
      $button.data('ishuman', !isHuman);
    });
  };

  Config.prototype.gameOptions = function () {
    return {
      player1IsHuman: this.$player1TypeButton.data('ishuman'),
      player2IsHuman: this.$player2TypeButton.data('ishuman')
    };
  };

  Config.prototype.removeListeners = function () {
    this.$player1TypeButton.off('click');
  };
})();

