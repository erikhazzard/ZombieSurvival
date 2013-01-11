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
            color: 'rgba(100,150,200,0.8)'
            #state can be 
            #  alive, dead, or zombie
            resources: 50
            state: 'alive'
            health: 100
        }

        initialize: ()->
            if @get('state') == 'resource'
                @set({'resources': Math.max(100, Math.round(Math.random() * 1500))})

            #When the state changes, change health based on state
            @on('change:state', (state)->
                health = 0
                if state == 'alive'
                    health = 100
                else if state == 'zombie'
                    health = 50

                if state = 'resource'
                    resources = Math.max(100, Math.round(Math.random() * 1500))
                else
                    resources = 10

                @set({ health: health, resources: resources })
            )
        getColor: (state)->
            colors = {
                alive: "rgb(100,220,100)"
                dead: "rgb(125,125,125)"
                resource: "rgb(125,175,225)"
                zombie: "rgb(220,100,100)"
            }

            return colors[state]

        getPossibleStates:()->
            return ['alive', 'dead', 'zombie']

    return Cell
)
