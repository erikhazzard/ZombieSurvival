(function() {

  requirejs.config({
    baseUrl: '/static/js',
    urlArgs: "v=" + (new Date()).getTime(),
    shim: {
      'lib/backbone': {
        deps: ['lib/underscore', 'lib/jquery'],
        exports: 'Backbone'
      }
    }
  });

  require(["jquery", "models/world", "views/world", "views/app"], function($, worldModel, worldView, appView) {
    var app, game, gameView;
    app = new appView();
    game = new worldModel();
    return gameView = new worldView({
      model: game
    });
  });

}).call(this);
