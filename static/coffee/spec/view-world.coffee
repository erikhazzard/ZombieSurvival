#========================================
#TEST - View - World
#========================================
define(['views/world', 'models/world-object'], (World, world)->
    world = new World({})
    describe('World View', ()->
        it('should exist', ()->
            world.should.not.equal(undefined)
        )
    )
)
