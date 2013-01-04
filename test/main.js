var Game, chai;

chai = require('chai');

chai.should();

Game = require('../src/main.js').Game;

describe('Game instance', function() {
  return it('should have cells', function() {
    var game;
    game = new Game();
    return task1.name.should.equal('');
  });
});
