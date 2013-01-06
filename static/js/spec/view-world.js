(function() {

  define(['views/world'], function(World) {
    return describe('World model', function() {
      return it('should have some default parameters', function() {
        var world;
        console.log(World);
        return world = new World({});
      });
    });
  });

}).call(this);
