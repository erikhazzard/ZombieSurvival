# ===========================================================================
#
# game - world model
#
# ===========================================================================
define(["logger", "lib/backbone", "models/cell", "models/item", "events"], (Logger, Backbone, Cell, Item, events)->
    class World extends Backbone.Model
        defaults: {
            #State of world
            cells: []

            tickLength: 100
            generationNum: 0

            numberOfRows: 250
            numberOfColumns: 250
            seedProbability: 0.2

            #Default - 23/3
            rules: {
                stayAlive: [2,3],
                birth: [3]
            }

            #if we should 'loop' the edges on itself (e.g., if the underlying topology
            #  is toroidal
            toroidal: true
            showTrails: true

            #List of entities - humans, zombies, etc
            #  TODO: Should items / resources be entities? Effects upon entering?
            entities: {
                #Entity types...
                human: []
                zombie: []
            }

            #List of all items
            items: []
        }

        initialize: ()=>
            #when the event aggregator recieves this event, update the rules
            events.on('world:model:changeRuleString', (ruleString)=>
                @updateRules(ruleString)
            )

            #NOTE: seedWorld() must be called, but it could be considered part 
            #  of the 'initialization' step
            return @

        #Helper function to add an entity to the world
        addEntity: (entity)->
            #When an entity is created, add it to the list
            entities = @get('entities')
            entities[entity.get('type')].push(entity)
            @set({ entities: entities })
            return @

        #--------------------------------
        #
        #World State - Cells
        #
        #--------------------------------
        seedWorld: ()->
            #Setup the initial cell game state
            startTime = new Date()
            Logger.log(
                'models/world',
                'seedWorld()',
                'seed started at: ', startTime)

            #----------------------------
            #Cells ( map )
            #----------------------------
            cells = []
            rows = @get('numberOfRows')
            columns = @get('numberOfColumns')
            for row in [0...rows]
                cells[row] = []
                for column in [0...columns]
                    seedCell = @createSeedCell(row, column)
                    cells[row][column] = seedCell

            @set({ cells: cells })
            #TODO:!!! Go through some generations with cellular automata

            #----------------------------
            #Done
            #----------------------------
            endTime = new Date()
            Logger.log(
                'models/world',
                'seedWorld()',
                'seed finished at: ', endTime,
                'total time: ' + (startTime.getTime() - endTime.getTime()))

            return @

        createSeedCell: (row, column)->
            #This sets up the initial state of the world
            state = 'empty'
            
            #----------------------------
            #Items - chance to spawn an item
            #----------------------------
            if Math.random() < (@get('seedProbability') / 18)
                items = @get('items')
                items.push( new Item({
                    position: {x: column, y: row}
                }) )
                @set({items: items})

            color = Cell.prototype.getColor(state)
            cell = new Cell({
                state: state
                color: color
                row: row
                column: column
                position: { x: column, y: row }
            })

            return cell
    
        #--------------------------------
        #
        #Helper - Update rules
        #
        #--------------------------------
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
