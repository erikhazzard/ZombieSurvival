#========================================
#TEST - Model - World
#========================================
define(['models/world', 'events'], (World, events)->
   describe('World Model: Default Params', ()->
        world = new World({})
        it('should have default param: cellSize', ()->
            world.get('cellSize').should.not.equal(undefined)
        )
        it('should have default param: rules', ()->
            world.get('rules').stayAlive.should.not.equal(undefined)
            world.get('rules').birth.should.not.equal(undefined)
        )

    )
    describe('World Model: updateRules', ()->
        world = new World({})
        it('should return false if nothing is passed in', ()->
            world.updateRules().should.equal(false)
        )
        it('should return false if "/" not found', ()->
            world.updateRules('').should.equal(false)
        )
        it('should return false if invalid rule found: "abc/123"', ()->
            world.updateRules('abc/123').should.equal(false)
        )
        it('should return false if invalid rule found: "/a"', ()->
            world.updateRules('/a').should.equal(false)
        )
        it('should return true if valid rule found: "/"', ()->
            world.updateRules('/').should.equal(true)
        )
        it('should return true if valid rule found: "23/"', ()->
            world.updateRules('23/').should.equal(true)
        )
        it('should return true if valid rule found: "23/3"', ()->
            world.updateRules('23/3').should.equal(true)
        )
        it('should return true if valid rule found: "/3"', ()->
            world.updateRules('/3').should.equal(true)
        )

        #update rules
        it('should update rules when 12/1 passed in', ()->
            #Make sure to set some default rule
            world.set({'rules': { stayAlive: [2,3], birth: [3] }})
            world.updateRules('12/1').should.equal(true)
            world.get('rules').stayAlive.should.deep.equal([1,2])
            world.get('rules').birth.should.deep.equal([1])
        )
        it('should update rules when /34 passed in', ()->
            world.set({'rules': { stayAlive: [2,3], birth: [3] }})
            world.updateRules('/34').should.equal(true)
            world.get('rules').stayAlive.should.deep.equal([])
            world.get('rules').birth.should.deep.equal([3,4])
        )
        it('should update rules when 3456/ passed in', ()->
            world.set({'rules': { stayAlive: [2,3], birth: [3] }})
            world.updateRules('3456/').should.equal(true)
            world.get('rules').stayAlive.should.deep.equal([3,4,5,6])
            world.get('rules').birth.should.deep.equal([])
        )
        it('should update rules when / passed in', ()->
            #Make sure to set some default rule
            world.set({'rules': { stayAlive: [2,3], birth: [3] }})
            world.updateRules('/').should.equal(true)
            world.get('rules').stayAlive.should.deep.equal([])
            world.get('rules').birth.should.deep.equal([])
        )
    )

    describe('World Model: updateRules', ()->
        world = new World({})
        it('should repond to world:model:changeRuleString"', ()->
            world.set({'rules': { stayAlive: [2,3], birth: [3] }})
            events.trigger('world:model:changeRuleString', '1/1')
            world.get('rules').stayAlive.should.deep.equal([1])
            world.get('rules').birth.should.deep.equal([1])
        )
    )
)
