define(['views/world'], (world)->
   describe('view', ()->
        it('should return true', ()->
            a = {a: true}
            a.a.should.equal(true)
        )
    )
)
