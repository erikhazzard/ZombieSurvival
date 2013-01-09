# ===========================================================================
#
# game - world view 
#
# ===========================================================================
define(["lib/backbone", "models/cell"], (Backbone, Cell)->
    class World extends Backbone.View
        #====================================
        #
        #Methods
        #
        #====================================
        initialize: ()->
            #Properties we'll use later
            @canvas = null
            return @

        render: ()->
            @createCanvas()
            @resizeCanvas()
            @createDrawingContext()
            @seed()
            @tick()
            return @

        #Setup canvas
        createCanvas: ()->
            @canvas = document.createElement('canvas')

            #When clicking on a cell, make neighboring cells alive
            @canvas.addEventListener('click', (e)=>
                x = e.x - @canvas.offsetLeft
                y = e.y - @canvas.offsetTop
                #Get the row / column the user clicked on
                cellColumn = Math.round(Math.floor(x / @model.get('cellSize')))
                cellRow = Math.round(Math.floor(y / @model.get('cellSize')))
                currentCellGeneration = @model.get('currentCellGeneration')
                
                #Make that cell alive
                currentCellGeneration[cellRow][cellColumn].set({state: 'alive'})

                #Get cells around current cell
                lowerRowBound = Math.max(cellRow - 1, 0)
                upperRowBound = Math.min(cellRow + 1, @model.get('numberOfRows') - 1)
                lowerColumnBound = Math.max(cellColumn - 1, 0)
                upperColumnBound = Math.min(cellColumn + 1, @model.get('numberOfColumns') - 1)

                #Set cells status to alive
                for row in [lowerRowBound..upperRowBound]
                    for column in [lowerColumnBound..upperColumnBound]
                        currentCellGeneration[row][column].set({state:'alive'})
     
            )
            document.body.appendChild(@canvas)

        resizeCanvas: ()->
            @canvas.width = @model.get('cellSize') * @model.get('numberOfColumns')
            @canvas.height = @model.get('cellSize') * @model.get('numberOfRows')

        createDrawingContext: ()->
            @drawingContext = @canvas.getContext('2d')

        #Initialize world
        seed: ()->
            currentCellGeneration = []
            for row in [0...@model.get('numberOfRows')]
                currentCellGeneration[row] = []
                for column in [0...@model.get('numberOfColumns')]
                    seedCell = @createSeedCell(row, column)
                    currentCellGeneration[row][column] = seedCell
            
            #Update the model
            @model.set('currentCellGeneration', currentCellGeneration)
            return @

        createSeedCell: (row, column)->
            #This sets up the initial state of the world
            
            if Math.random() < @model.get('seedProbability')
                state = 'alive'
            else
                state = 'dead'

            #Seed some zombies - TODO, should be player controlled?
            if Math.random() < (@model.get('zombieProbability') / 4 )
                state = 'zombie'

            return new Cell({
                state: state
                row: row
                column: column
            })

        tick: ()=>
            #Tick function - called at every time interval to update
            #  the world
            #setTimeout(@tick, 2000)
            requestAnimFrame(@tick)
            @drawGrid()
            @updateCurrentGeneration()

        #draw world
        drawGrid: ()->
            for row in [0...@model.get('numberOfRows')]
                for column in [0...@model.get('numberOfColumns')]
                    @drawCell(@model.get('currentCellGeneration')[row][column])
            return true

        drawCell: (cell)->
            #Draws a cell with canvas
            #
            #Store local refs
            cellSize = @model.get('cellSize')

            #Calculate x / y, draw cells
            x = cell.get('column') * cellSize
            y = cell.get('row') * cellSize
            fillStyle = cell.get('color')
            
            #@drawingContext.strokeStyle = 'rgba(0,50,100,0.5)'
            @drawingContext.strokeStyle = 'rgb(100,100,100)'
            @drawingContext.strokeRect(x,y,cellSize, cellSize)
            @drawingContext.fillStyle = fillStyle
            @drawingContext.fillRect(x,y,cellSize,cellSize)

            return @

        #------------------------------------
        #Evolve cell
        #------------------------------------
        evolveCell: (cell)->
            #This function determins if a cell is born or dies
            evolvedCell = new Cell({
                row: cell.get('row')
                column: cell.get('column')
                state: cell.get('state')
            })
            neighbors = @countNeighbors(cell)

            ##Based on its neighbors (and if it's alive already), implement
            ##  rules for birth and death
            ##RULES (XY/Z rule) (first numbers are requirements for staying alive, 
            ##  second number is requirement for birth):
            ##  1. cell is born if it has exactly 3 living neighbors
            ##  2. stays alive (must already be alive) if it has 2 or 3 living neighbors
            ##  3. dies otherwise 
            #23/3

            #Previous state is maintained by default
            state = cell.get('state')

            #ZOMBIES
            if cell.get('state') == 'zombie'
                if neighbors.alive >= 4
                    state = 'dead'
                else if (neighbors.alive < 4)
                    state = 'zombie'

                    #Also, zombies decay so there is a small chance it will just die
                    if Math.random() < 0.05
                        state = 'dead'

            #HUMANS
            else if cell.get('state') == 'alive'
                if neighbors.zombie > neighbors.alive
                    if Math.random() < 0.5
                        state = 'zombie'

                #Humans die of old age
                if Math.random() < 0.05
                    state = 'zombie'

            #DEAD / EMPTY
            else if cell.get('state') == 'dead'
                if neighbors.alive > neighbors.zombie
                    #chance for birth
                    if Math.random() < 0.05
                        state = 'alive'
                else
                    state = 'dead'
                

            #Set updated cell
            #----------------------------
            evolvedCell.set({
                state: state
                color: cell.getColor( state )
            })

            return evolvedCell

        updateCurrentGeneration: ()->
            #This function gets the 'evoled' cell for each cell and
            #  updates the model's currentCellGeneration object

            #Update the current generation count
            generationNum = @model.get('generationNum')
            @model.set('generationNum', generationNum + 1)

            #Get new cell states
            newCellGeneration = {}
            for row in [0...@model.get('numberOfRows')]
                newCellGeneration[row] = []
                for column in [0...@model.get('numberOfColumns')]
                    evolvedCell = @evolveCell(@model.get('currentCellGeneration')[row][column])
                    newCellGeneration[row][column] = evolvedCell

            @model.set('currentCellGeneration', newCellGeneration)

        countNeighbors: (cell)->
            #This function calculates neighbors. If toroidal is true, the world
            #  will loop in on itself
            numberOfRows = @model.get('numberOfRows')
            numberOfColumns = @model.get('numberOfColumns')
            cellRow = cell.get('row')
            cellColumn = cell.get('column')

            #Calculate the x,y if it's near the edges
            lowerRowBound = Math.max(cellRow - 1, 0)
            upperRowBound = Math.min(cellRow + 1, numberOfRows - 1)
            lowerColumnBound = Math.max(cellColumn - 1, 0)
            upperColumnBound = Math.min(cellColumn + 1, numberOfColumns - 1)

            #States
            neighbors = {
                alive: 0
                dead: 0
                zombie: 0
            }

            if @model.get('toroidal')
                #Loop edges on itself
                rowBot = cellRow - 1
                rowTop = cellRow + 1
                colBot = cellColumn - 1
                colTop= cellColumn + 1
                for curRow in [rowBot..rowTop]
                    for curColumn in [colBot..colTop]
                        continue if curRow is cellRow and curColumn is cellColumn

                        row = curRow
                        column = curColumn
                        #Wrap around map
                        if row < 0
                            row = numberOfRows - 1
                        else if row > numberOfRows
                            row = 0
                        else if row > (numberOfRows - 1)
                            row = 0
                        
                        if column < 0
                            column = numberOfColumns - 1
                        else if column > numberOfColumns
                            column = 0
                        else if column > (numberOfColumns - 1)
                            column = 0
                        
                        neighbors[@model.get('currentCellGeneration')[row][column].get('state')] += 1
            else
                #This is the simpler method, but it cuts off the edges
                for row in [lowerRowBound..upperRowBound]
                    for column in [lowerColumnBound..upperColumnBound]
                        #Skip itself
                        continue if row is cellRow and column is cellColumn
                        neighbors[@model.get('currentCellGeneration')[row][column].get('state')] += 1

            return neighbors

    return World
)
