(function() {

  define(['views/world'], function(world) {
    return describe('view', function() {
      return it('should return true', function() {
        var a;
        a = {
          a: true
        };
        return a.a.should.equal(true);
      });
    });
  });

}).call(this);
