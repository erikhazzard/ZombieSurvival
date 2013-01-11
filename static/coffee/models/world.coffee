# ===========================================================================
#
# game - world model
#
# ===========================================================================
define(["lib/backbone", "events"], (Backbone, events)->
    class World extends Backbone.Model
        defaults: {
            #State of world
            currentCellGeneration: null
            canvas: null
            drawingContext: null
            tickLength: 100
            generationNum: 0

            cellSize: 12
            numberOfRows: 30
            numberOfColumns: 30
            seedProbability: 0.08
            zombieProbability: 0.01
            resourceProbability: 0.0005
            #Default - 23/3
            rules: {
                stayAlive: [2,3],
                birth: [3]
            }
            #if we should 'loop' the edges on itself (e.g., if the underlying topology
            #  is toroidal
            toroidal: true
            showTrails: true
        }

        initialize: ()=>
            #when the event aggregator recieves this event, update the rules
            events.on('world:model:changeRuleString', (ruleString)=>
                @updateRules(ruleString)
            )
            return @
    
        updateRules: (ruleString)=>
            #This function takes in a rules {String} in the format of
            #  XYZ/X'Y'Z'
            #  where XYZ is the rules for staying alive and 
            #  X'Y'Z' are the rules for birth. 
            #  The '/' MUST be present
            #  E.g.,
            #   '23/3' would be the standard conway game of life rules
            #if it doesn't exist, make it an empty string
            ruleString = ruleString or '' 
            #Make sure a '/' is in the rule string
            if not ruleString.match(/^[0-9]*\/[0-9]*$/)
                return false

            #Reset to empty rules
            newRules = {
                stayAlive: []
                birth: []
            }

            #Update rules based on rule string
            ruleArray = ruleString.split('/')
            liveRules = ruleArray[0].split('')
            birthRules = ruleArray[1].split('')

            for character in liveRules
                #Use + operator to get value of the string (effectively 
                #  converting it to a number)
                newRules.stayAlive.push(+character)

            for character in birthRules
                newRules.birth.push(+character)

            @set({ rules: newRules })

            return true

    return World
)
