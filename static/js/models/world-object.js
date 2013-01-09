(function() {

  define(["lib/backbone", "models/world"], function(Backbone, World) {
    var world;
    world = new World({});
    world.seedWorld();
    return world;
  });

}).call(this);
