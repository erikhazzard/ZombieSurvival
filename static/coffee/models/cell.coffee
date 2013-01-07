# ===========================================================================
#
# game - cell model
#
# ===========================================================================
define(["lib/backbone"], (Backbone)->
    class Cell extends Backbone.Model
        #Either dead or alive
        defaults: {
            isAlive: true
            color: 'rgb(125,125,125)'
            state: 'empty'
        }
        getColor: (state)->
            colors = {
                empty: "rgb(125,125,125)"
                resource: "rgb(100,220,100)"
                weapon: "rgb(100,150,200)"
                shelter: "rgb(50,50,50)"
            }

            return colors[state]

    return Cell
)
