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

  require(["jquery", "models/world", "models/world-object", "views/world", "views/app"], function($, World, world, WorldView, AppView) {
    var app, gameView;
    app = new AppView();
    gameView = new WorldView({});
    return gameView.render();
  });

}).call(this);
