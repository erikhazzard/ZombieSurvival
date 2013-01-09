
define(['models/world', 'models/world-object', 'events'], function(World, world, events) {
  describe('World Model: Default Params', function() {
    return it('should have default param: rules', function() {
      world.get('rules').stayAlive.should.not.equal(void 0);
      return world.get('rules').birth.should.not.equal(void 0);
    });
  });
  describe('World Model: updateRules', function() {
    it('should return false if nothing is passed in', function() {
      return world.updateRules().should.equal(false);
    });
    it('should return false if "/" not found', function() {
      return world.updateRules('').should.equal(false);
    });
    it('should return false if invalid rule found: "abc/123"', function() {
      return world.updateRules('abc/123').should.equal(false);
    });
    it('should return false if invalid rule found: "/a"', function() {
      return world.updateRules('/a').should.equal(false);
    });
    it('should return true if valid rule found: "/"', function() {
      return world.updateRules('/').should.equal(true);
    });
    it('should return true if valid rule found: "23/"', function() {
      return world.updateRules('23/').should.equal(true);
    });
    it('should return true if valid rule found: "23/3"', function() {
      return world.updateRules('23/3').should.equal(true);
    });
    it('should return true if valid rule found: "/3"', function() {
      return world.updateRules('/3').should.equal(true);
    });
    it('should update rules when 12/1 passed in', function() {
      world.set({
        'rules': {
          stayAlive: [2, 3],
          birth: [3]
        }
      });
      world.updateRules('12/1').should.equal(true);
      world.get('rules').stayAlive.should.deep.equal([1, 2]);
      return world.get('rules').birth.should.deep.equal([1]);
    });
    it('should update rules when /34 passed in', function() {
      world.set({
        'rules': {
          stayAlive: [2, 3],
          birth: [3]
        }
      });
      world.updateRules('/34').should.equal(true);
      world.get('rules').stayAlive.should.deep.equal([]);
      return world.get('rules').birth.should.deep.equal([3, 4]);
    });
    it('should update rules when 3456/ passed in', function() {
      world.set({
        'rules': {
          stayAlive: [2, 3],
          birth: [3]
        }
      });
      world.updateRules('3456/').should.equal(true);
      world.get('rules').stayAlive.should.deep.equal([3, 4, 5, 6]);
      return world.get('rules').birth.should.deep.equal([]);
    });
    return it('should update rules when / passed in', function() {
      world.set({
        'rules': {
          stayAlive: [2, 3],
          birth: [3]
        }
      });
      world.updateRules('/').should.equal(true);
      world.get('rules').stayAlive.should.deep.equal([]);
      return world.get('rules').birth.should.deep.equal([]);
    });
  });
  return describe('World Model: updateRules', function() {
    return it('should repond to world:model:changeRuleString"', function() {
      world.set({
        'rules': {
          stayAlive: [2, 3],
          birth: [3]
        }
      });
      events.trigger('world:model:changeRuleString', '1/1');
      world.get('rules').stayAlive.should.deep.equal([1]);
      return world.get('rules').birth.should.deep.equal([1]);
    });
  });
});
