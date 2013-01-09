# ===========================================================================
#
# game - cell model
#
# ===========================================================================
define(["lib/backbone"], (Backbone)->
    class Cell extends Backbone.Model
        #Either dead or alive
        defaults: {
            state: 'empty'
            #if a cell is occupied by an entity,
            #  other entities cannot occupy it
            occupied: false
            position: { x: 0, y: 0 }

            #0 is unpassable, 1 is passable. Any numbers 
            #  heigher affect the weight
            weight: 1
            color: 'rgb(100,220,100)'

            #TODO: cellular automata, generate terrain
        }

        initialize: ()->
            #When the state changes, update the color
            @on('change:state', (state)->
                @set({ color: @getColor(state) })
            )

        getColor: (state)->
            colors = {
                empty: "rgb(100,220,100)"
            }

            return colors[state]

    return Cell
)
