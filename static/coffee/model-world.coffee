# ===========================================================================
#
# game - world model
#
# ===========================================================================
class GAME.Models.World extends Backbone.Model
    defaults: {
        #State of world
        currentCellGeneration: null
        canvas: null
        drawingContext: null
        tickLength: 100
        tickNum: 0

        cellSize: 12
        numberOfRows: 50
        numberOfColumns: 50
        seedProbability: 0.4
        #Default - 23/3
        rules: {
            stayAlive: [2,3]
            birth: [3]
        }
        #if we should 'loop' the edges on itself (e.g., if the underlying topology
        #  is toroidal
        toroidal: true
        showTrails: true
    }

    initialize: ()=>
        return @
