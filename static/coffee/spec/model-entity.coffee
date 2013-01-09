#========================================
#TEST - Model - World
#========================================
define(['models/entity', 'models/world-object', 'models/world', 'events'], (Entity, world, World, events)->
    entity = new Entity({})
    world.addEntity(entity)

    #Default params
    describe('Entity Model: Default Params', ()->
        it('should have default param: state', ()->
            entity.get('state').should.equal('alive')
        )
        it('should have default param: position', ()->
            entity.get('position').should.not.equal(undefined)
        )
        it('should have default param: position x', ()->
            entity.get('position').x.should.not.equal(undefined)
        )
        it('should have default param: position y', ()->
            entity.get('position').y.should.not.equal(undefined)
        )
        it('should have default param: position y', ()->
            entity.get('position').y.should.not.equal(undefined)
        )
    )

    #Method tests
    #------------------------------------
    describe('Entity Model: getNeighborCells()', ()->
        cells = world.get('cells')
        neighbors = entity.getNeighborCells()

        #getNeighborCells() starts in upper left and works around row by row
        #In a world that loops back on itself, the top left neighbor is the
        #  last row and last column
        rows = world.get('numberOfRows')
        columns = world.get('numberOfColumns')

        it('should return 8 cells', ()->
            neighbors.length.should.equal(8)
        )

        #Check moore neighborhood and make sure it loops around
        # ROW 1
        it('top left neighbor should loop around, [ROWS,ROWS]', ()->
            neighbors[0].should.equal(cells[rows-1][columns-1])
        )
        it('top mid neighbor should loop around, [ROWS,0]', ()->
            neighbors[1].should.equal(cells[rows-1][0])
        )
        it('top right neighbor should loop around, [ROWS,1]', ()->
            neighbors[2].should.equal(cells[rows-1][1])
        )

        # ROW 2
        it('left neighbor should be [0,ROWS]', ()->
            neighbors[3].should.equal(cells[0][rows-1])
        )
        it('right neighbor should be [0,1]', ()->
            neighbors[4].should.equal(cells[0][1])
        )

        #ROW 3
        it('bottom left neighbor should be [1,ROWS]', ()->
            neighbors[5].should.equal(cells[1][rows-1])
        )
        it('bottom mid neighbor should be [1,0]', ()->
            neighbors[6].should.equal(cells[1][0])
        )
        it('bottom right neighbor should be [1,1]', ()->
            neighbors[7].should.equal(cells[1][1])
        )

        console.log(neighbors)
    )

    #Move
    #------------------------------------
    describe('Entity Model: tick()', ()->
        entity.tick()
    )

    #Tick test
    #------------------------------------
    describe('Entity Model: tick()', ()->
        entity.tick()
    )
)
