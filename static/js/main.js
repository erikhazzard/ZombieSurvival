(function() {
  var init, root, window;

  if (window) {
    window.requestAnimFrame = (function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
    })();
  } else {
    window = {};
  }

  init = function() {
    var game, gameView;
    game = new GAME.Models.World();
    gameView = new GAME.Views.World({
      model: game
    });
    return gameView.render();
  };

  window.onload = init;

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.GAME = GAME;

}).call(this);
