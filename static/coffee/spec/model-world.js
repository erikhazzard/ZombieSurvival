
define(['models/world'], function(world) {
  return describe('model', function() {
    return it('should return true', function() {
      var a;
      a = {
        a: true
      };
      return a.a.should.equal(true);
    });
  });
});
