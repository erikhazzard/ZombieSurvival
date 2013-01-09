# ===========================================================================
#
# game - items
#   resources, food, health, weapons, armor, etc
#
# ===========================================================================
define(["lib/backbone", "events"], (Backbone, events)->
    class Item extends Backbone.Model
        #Either dead or alive
        defaults: {
            position: { x: 0, y: 0 }

            color: 'rgb(200,120,120)'
        }

        initialize: ()->
            #When the state changes, update the color

        getColor: (state)->
            colors = {
                weapon: "rgb(200,120,120)"
            }

            return colors[state]

        use: (entity)->
            #TODO: add effects based on item type
            entity.updateHealth(20)
            #Let event aggregator know this item shouldn't exist anymore
            this.destroy()

    return Item
)
