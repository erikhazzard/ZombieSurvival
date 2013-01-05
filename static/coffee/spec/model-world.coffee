define(['models/world'], (world)->
   describe('model', ()->
        it('should return true', ()->
            a = {a: true}
            a.a.should.equal(true)
        )
    )
)
