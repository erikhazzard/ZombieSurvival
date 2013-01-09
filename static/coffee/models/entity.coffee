# ===========================================================================
#
# game - entity model
#
# ===========================================================================
define(["lib/backbone", "models/world-object", "lib/graph", "lib/astar"], (Backbone, world, Graph, astar)->
    class Entity extends Backbone.Model
        defaults: {
            #can be alive, dead, or zombie
            state: "alive"
            #position on the game world (x,y)
            position: {x: 0, y: 0}
            color: 'rgb(255,255,255)'

            desires: {
                shelter: 25
                resources: 25
                community: 25
            }

            #Starting attributes (without any mods)
            baseAttributes: {
                health: 100
                attack: 10
                defense: 20
                energy: 100
            }

            attributes: {
                health: 100
                attack: 10
                defense: 20
                energy: 100
            }

            #Array of item objects
            items: []

            #How far the entity can see
            visionRange: 1

            #Type can be (for now) human or zombie
            type: 'human'

            #list of moves to make
            moveQueue: []
        }
        getColor: (state)->
            colors = {
                alive: "rgb(255,255,255)"
            }

            return colors[state]

        #--------------------------------
        #
        #AI Functions
        #
        #--------------------------------
        tick: ()->
            #This function is executed each game tick.  The entity
            #  figures out what it should do

            #First, get cells
            cells = @getNeighborCells()



#            graph = new Graph([
                #[1,1,1,1],
                #[0,1,1,0],
                #[0,0,1,1]
            #])
            #start = graph.nodes[0][0]
            #end = graph.nodes[2][3]
            #result = astar.search(graph.nodes, start, end)
            #resultWithDiagonals = astar.search(graph.nodes, start, end, true)
            #console.log('RESULT', result)

            items = world.get('items')
            #if no moves to make
            if @get('moveQueue').length < 1
                #See if anything is found in a cell
                foundGoal = false
                for item in items
                    targetCellPosition = item.get('position')
                    foundGoal = true
                    goal = item
                    break

                #Calculate the move queue
                #  difference between current position and cell position
                if foundGoal
                    moveQueue = @calculateMoveQueue(@get('position'), item.get('position'))
                    @set({moveQueue: moveQueue})
            else
                @moveInQueue(goal)

            return @

        calculateMoveQueue: (position, cellPosition)->
            #get an array of steps
            #get bigger number between x and y
            #Get smaller number between (x - cell.x) AND
            #  (numRows - 
            xDiff = Math.min(
                Math.abs(position.x - cellPosition.x),
                Math.abs(world.get('numberOfColumns') - cellPosition.x)
            )
            yDiff = Math.min(
                Math.abs(position.y - cellPosition.y),
                Math.abs(world.get('numberOfRows') - cellPosition.y)
            )

            newMoveQueue = []

            #Which diff to use?
            iterations = xDiff
            if yDiff > xDiff
                iterations = xDiff

            for i in [0..iterations]
                stepAmount = {x:0,y:0}
                #x
                if position.x < cellPosition.x
                    stepAmount.x = 1
                else if position.x > cellPosition.x
                    stepAmount.x = -1
                #y
                if position.y < cellPosition.y
                    stepAmount.y = 1
                else if position.y > cellPosition.y
                    stepAmount.y = -1

                newMoveQueue.push(stepAmount)

            return newMoveQueue

        moveInQueue: (item)->
            #Moves to the next cell in the movement queue
            queue = @get('moveQueue')
            position = @get('position')
            
            #Get and remove first index of move queue
            positionDelta = queue.shift()
            @set({moveQueue: queue})
            
            newX = position.x + positionDelta.x
            newY = position.y + positionDelta.y
            @set({ position: {
                x: newX
                y: newY
            }})

            #TODO: REPLACE WITH ENTITY LOGIC
            #If this was the last move, empty the cell
            if queue.length < 1
                if newX < 0
                    newX = (world.get('numberOfColumns') - 1) + newX
                if newY < 0
                    newY = (world.get('numberOfRows') - 1) + newY

                console.log(item)
                item.use(@)
                items = world.get('items')
                items.pop(goal)

            return @

        moveTo: (cell)->
            #Moves an entity to a target cell
            position = cell.get('position')
            @set({ position: {
                x: position.x
                y: position.y
            }})

            return @

        getNeighborCells: ()->
            #Gets all the cells surrounding the entity

            #This function calculates neighbors. If toroidal is true, the world
            #  will loop in on itself
            numberOfRows = world.get('numberOfRows')
            numberOfColumns = world.get('numberOfColumns')
            cellColumn = @get('position').x
            cellRow = @get('position').y
            visionRange = @get('visionRange')

            #Calculate the x,y if it's near the edges
            lowerRowBound = Math.max(cellRow - visionRange, 0)
            upperRowBound = Math.min(cellRow + visionRange, numberOfRows - visionRange)
            lowerColumnBound = Math.max(cellColumn - visionRange, 0)
            upperColumnBound = Math.min(cellColumn + visionRange, numberOfColumns - visionRange)

            #States
            neighbors = []
            cells = world.get('cells')

            if world.get('toroidal')
                #Loop edges on itself
                rowBot = cellRow - visionRange
                rowTop = cellRow + visionRange
                colBot = cellColumn - visionRange
                colTop= cellColumn + visionRange
                for curRow in [rowBot..rowTop]
                    for curColumn in [colBot..colTop]
                        continue if curRow is cellRow and curColumn is cellColumn

                        row = curRow
                        column = curColumn
                        #Wrap around map
                        if row < 0
                            row = numberOfRows - visionRange
                        else if row > numberOfRows
                            row = 0
                        else if row > (numberOfRows - visionRange)
                            row = 0
                        
                        if column < 0
                            column = numberOfColumns - visionRange
                        else if column > numberOfColumns
                            column = 0
                        else if column > (numberOfColumns - visionRange)
                            column = 0
                        
                        neighbors.push(cells[row][column])
            else
                #NON Toroidal, world cuts off at edges
                #This is the simpler method, but it cuts off the edges
                
                for row in [lowerRowBound..upperRowBound]
                    for column in [lowerColumnBound..upperColumnBound]
                        #Skip itself
                        continue if row is cellRow and column is cellColumn
                        neighbors.push(cells[row][column])

            #Done, return neighbors
            return neighbors

    return Entity
)
