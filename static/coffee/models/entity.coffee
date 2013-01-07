# ===========================================================================
#
# game - entity model
#
# ===========================================================================
define(["lib/backbone"], (Backbone)->
    class Entity extends Backbone.Model
        defaults: {
            #can be alive, dead, or zombie
            state: "alive"
            #position on the game world (x,y)
            position: {x: 0, y: 0}
            color: 'rgb(255,255,255)'
        }
        getColor: (state)->
            colors = {
                alive: "rgb(255,255,255)"
            }

            return colors[state]

    return Entity
)
