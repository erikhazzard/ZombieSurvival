var GAME, chai;

chai = require('chai');

chai.should();

GAME = require('../src/namespace.js').GAME;

require('../src/model-world.js');

require('../src/view-world.js');

describe('Game instance', function() {
  return it('should have starting params', function() {
    var game;
    game = new GAME.Models.Game();
    game.cellSize.should.not.equal(void 0);
    game.numberOfRows.should.not.equal(void 0);
    game.numberOfColumns.should.not.equal(void 0);
    game.seedProbability.should.not.equal(void 0);
    game.rules.should.not.equal(void 0);
    game.rules.stayAlive.should.not.equal(void 0);
    return game.rules.birth.should.not.equal(void 0);
  });
});
