# ===========================================================================
#
# game - world view 
#
# ===========================================================================
define(["lib/backbone"], (Backbone)->
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
                currentCellGeneration[cellRow][cellColumn].isAlive = true

                #Get cells around current cell
                lowerRowBound = Math.max(cellRow - 1, 0)
                upperRowBound = Math.min(cellRow + 1, @model.get('numberOfRows') - 1)
                lowerColumnBound = Math.max(cellColumn - 1, 0)
                upperColumnBound = Math.min(cellColumn + 1, @model.get('numberOfColumns') - 1)

                #Set cells status to alive
                for row in [lowerRowBound..upperRowBound]
                    for column in [lowerColumnBound..upperColumnBound]
                        currentCellGeneration[row][column].isAlive = true
     
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
            return {
                isAlive: Math.random() < @model.get('seedProbability')
                row: row
                column: column
            }

        tick: ()=>
            #Tick function - called at every time interval to update
            #  the world
            requestAnimFrame(@tick)
            @drawGrid()
            @updateCurrentGeneration()

        #draw world
        drawGrid: ()->
            for row in [0...@model.get('numberOfRows')]
                for column in [0...@model.get('numberOfColumns')]
                    @drawCell(@model.get('currentCellGeneration')[row][column])

        drawCell: (cell)->
            #Draws a cell with canvas

            #Store local refs
            cellSize = @model.get('cellSize')

            #Calculate x / y, draw cells
            x = cell.column * cellSize
            y = cell.row * cellSize
            @model.set({'showTrails': true})
            if cell.isAlive
                if @model.get('showTrails')
                    fillStyle = 'rgba(100,150,200,0.7)'
                else
                    fillStyle = 'rgb(100,200,100)'
            else
                if @model.get('showTrails')
                    fillStyle = 'rgba(125,125,125,0.8)'
                else
                    fillStyle = 'rgb(125,125,125)'
            
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
            evolvedCell = {
                row: cell.row
                column: cell.column
                isAlive: cell.isAlive
            }
            numAliveNeighbors = @countAliveNeighbors(cell)

            ##Based on its neighbors (and if it's alive already), implement
            ##  rules for birth and death
            ##RULES (XY/Z rule) (first numbers are requirements for staying alive, 
            ##  second number is requirement for birth):
            ##  1. cell is born if it has exactly 3 living neighbors
            ##  2. stays alive (must already be alive) if it has 2 or 3 living neighbors
            ##  3. dies otherwise 
            #23/3
            #if cell.isAlive or numAliveNeighbors is 3
            #    evolvedCell.isAlive = 1 < numAliveNeighbors < 4
            
            if cell.isAlive and (@model.get('rules').stayAlive.indexOf(numAliveNeighbors) > -1)
                #If it's already alive, check to see if it should stay alive
                evolvedCell.isAlive = true
            else if @model.get('rules').birth.indexOf(numAliveNeighbors) > -1
                #If it wasn't alive, check for birth
                evolvedCell.isAlive = true
            else
                #The number of neighbors don't match the rule, so it's dead
                evolvedCell.isAlive = false

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

        countAliveNeighbors: (cell)->
            #This function calculates neighbors. If toroidal is true, the world
            #  will loop in on itself

            numberOfRows = @model.get('numberOfRows')
            numberOfColumns = @model.get('numberOfColumns')

            #Calculate the x,y if it's near the edges
            lowerRowBound = Math.max(cell.row - 1, 0)
            upperRowBound = Math.min(cell.row + 1, numberOfRows - 1)
            lowerColumnBound = Math.max(cell.column - 1, 0)
            upperColumnBound = Math.min(cell.column + 1, numberOfColumns - 1)

            numAliveNeighbors = 0

            if @model.get('toroidal')
                #Loop edges on itself
                rowBot = cell.row - 1
                rowTop = cell.row + 1
                colBot = cell.column - 1
                colTop= cell.column + 1
                for curRow in [rowBot..rowTop]
                    for curColumn in [colBot..colTop]
                        continue if curRow is cell.row and curColumn is cell.column

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
                        
                        #Found a neighbor
                        if @model.get('currentCellGeneration')[row][column].isAlive
                            numAliveNeighbors += 1

            else
                #This is the simpler method, but it cuts off the edges
                for row in [lowerRowBound..upperRowBound]
                    for column in [lowerColumnBound..upperColumnBound]
                        #Skip itself
                        continue if row is cell.row and column is cell.column
                        if @model.get('currentCellGeneration')[row][column].isAlive
                            numAliveNeighbors += 1


            return numAliveNeighbors

    return World
)
