(function() {

  requirejs.config({
    baseUrl: '/static/js',
    shim: {
      'lib/backbone': {
        deps: ['lib/underscore', 'lib/jquery'],
        exports: 'Backbone'
      }
    }
  });

  require(["jquery", "models/world", "views/world"], function($, worldModel, worldView) {
    var game, gameView;
    game = new worldModel();
    gameView = new worldView({
      model: game
    });
    return gameView.render();
  });

}).call(this);
