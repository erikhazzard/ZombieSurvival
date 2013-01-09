(function() {

  define(['views/world', 'models/world-object'], function(World, world) {
    world = new World({});
    return describe('World View', function() {
      return it('should exist', function() {
        return world.should.not.equal(void 0);
      });
    });
  });

}).call(this);
