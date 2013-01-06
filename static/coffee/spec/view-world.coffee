#========================================
#TEST - View - World
#========================================
define(['views/world'], (World)->
   describe('World model', ()->
        it('should have some default parameters', ()->
            console.log(World)
            world = new World({})
        )
    )
)
