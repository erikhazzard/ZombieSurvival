(function() {

  define(['models/world'], function(world) {
    return describe('Test', function() {
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
