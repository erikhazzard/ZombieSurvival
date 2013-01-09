(function() {

  define(["lib/backbone", "models/world"], function(Backbone, World) {
    var world;
    world = new World({});
    return world;
  });

}).call(this);
