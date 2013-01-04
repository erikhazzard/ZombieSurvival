chai = require('chai')
chai.should()
{Game} = require('../src/main.js')

describe('Game instance', ()->
    it('should have starting params', ()->
        game = new Game()
        
        #Test for params
        game.cellSize.should.not.equal(undefined)
        game.numberOfRows.should.not.equal(undefined)
        game.numberOfColumns.should.not.equal(undefined)
        game.seedProbability.should.not.equal(undefined)

        #living / birth rules
        game.rules.should.not.equal(undefined)
        game.rules.stayAlive.should.not.equal(undefined)
        game.rules.birth.should.not.equal(undefined)
    )
)
