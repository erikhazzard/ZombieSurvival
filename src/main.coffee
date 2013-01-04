if window
    window.requestAnimFrame = (()->
        return window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback)->
            window.setTimeout(callback, 1000 / 60)
    )()
else
    window = {}

#========================================
#Class definition
#========================================
class Game
    currentCellGeneration: null
    canvas: null
    drawingContext: null
    tickLength: 100
    tickNum: 0

    #Configurable options
    cellSize: 10
    numberOfRows: 50
    numberOfColumns: 50
    seedProbability: 0.4
    #Default - 23/3
    ruleStayAlive: [2,3]
    ruleBirth: [3]
    #if we should 'loop' the edges on itself (e.g., if the underlying topology
    #  is toroidal
    toroidal: true

    showTrails: false


    constructor: ()->
        @createCanvas()
        @resizeCanvas()
        @createDrawingContext()
        @seed()
        @tick()

    #Setup canvas
    createCanvas: ()->
        @canvas = document.createElement('canvas')

        #When clicking on a cell, make neighboring cells alive
        @canvas.addEventListener('click', (e)=>
            x = e.x - @canvas.offsetLeft
            y = e.y - @canvas.offsetTop
            #Get the row / column the user clicked on
            cellColumn = Math.round(Math.floor(x / @cellSize))
            cellRow = Math.round(Math.floor(y / @cellSize))
            
            #Make that cell alive
            @currentCellGeneration[cellRow][cellColumn].isAlive = true

            #Get cells around current cell
            lowerRowBound = Math.max(cellRow - 1, 0)
            upperRowBound = Math.min(cellRow + 1, @numberOfRows - 1)
            lowerColumnBound = Math.max(cellColumn - 1, 0)
            upperColumnBound = Math.min(cellColumn + 1, @numberOfColumns - 1)

            #Set cells status to alive
            for row in [lowerRowBound..upperRowBound]
                for column in [lowerColumnBound..upperColumnBound]
                    @currentCellGeneration[row][column].isAlive = true
 
        )
        document.body.appendChild(@canvas)

    resizeCanvas: ()->
        @canvas.width = @cellSize * @numberOfColumns
        @canvas.height = @cellSize * @numberOfRows

    createDrawingContext: ()->
        @drawingContext = @canvas.getContext('2d')

    #Initialize world
    seed: ()->
        @currentCellGeneration = []
        for row in [0...@numberOfRows]
            @currentCellGeneration[row] = []
            for column in [0...@numberOfColumns]
                seedCell = @createSeedCell(row, column)
                @currentCellGeneration[row][column] = seedCell
        return @

    createSeedCell: (row, column)->
        return {
            isAlive: Math.random() < @seedProbability
            row: row
            column: column
        }

    tick: ()=>
        @drawGrid()
        @updateCurrentGeneration()
        requestAnimFrame(@tick)

    #draw world
    drawGrid: ()->
        for row in [0...@numberOfRows]
            for column in [0...@numberOfColumns]
                @drawCell(@currentCellGeneration[row][column])

    drawCell: (cell)->
        x = cell.column * @cellSize
        y = cell.row * @cellSize
        if cell.isAlive
            if @showTrails
                fillStyle = 'rgba(100,200,100,0.7)'
            else
                fillStyle = 'rgb(100,200,100)'
        else
            if @showTrails
                fillStyle = 'rgba(125,125,125,0.5)'
            else
                fillStyle = 'rgb(125,125,125)'
        
        #@drawingContext.strokeStyle = 'rgba(0,50,100,0.5)'
        @drawingContext.strokeStyle = 'rgb(100,100,100)'
        @drawingContext.strokeRect(x,y,@cellSize, @cellSize)

        @drawingContext.fillStyle = fillStyle
        @drawingContext.fillRect(x,y,@cellSize,@cellSize)

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
        
        if cell.isAlive and (@ruleStayAlive.indexOf(numAliveNeighbors) > -1)
            #If it's already alive, check to see if it should stay alive
            evolvedCell.isAlive = true
        else if @ruleBirth.indexOf(numAliveNeighbors) > -1
            #If it wasn't alive, check for birth
            evolvedCell.isAlive = true
        else
            #The number of neighbors don't match the rule, so it's dead
            evolvedCell.isAlive = false

        return evolvedCell

    updateCurrentGeneration: ()->
        newCellGeneration = {}
        for row in [0...@numberOfRows]
            newCellGeneration[row] = []
            for column in [0...@numberOfColumns]
                evolvedCell = @evolveCell(@currentCellGeneration[row][column])
                newCellGeneration[row][column] = evolvedCell

        @currentCellGeneration = newCellGeneration

    countAliveNeighbors: (cell)->
        #This function

        #Calculate the x,y if it's near the edges
        lowerRowBound = Math.max(cell.row - 1, 0)
        upperRowBound = Math.min(cell.row + 1, @numberOfRows - 1)
        lowerColumnBound = Math.max(cell.column - 1, 0)
        upperColumnBound = Math.min(cell.column + 1, @numberOfColumns - 1)

        numAliveNeighbors = 0

        if @toroidal
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
                        row = @numberOfRows - 1
                    else if row > @numberOfRows
                        row = 0
                    else if row > (@numberOfRows - 1)
                        row = 0
                    
                    if column < 0
                        column = @numberOfColumns - 1
                    else if column > @numberOfColumns
                        column = 0
                    else if column > (@numberOfColumns - 1)
                        column = 0
                    
                    if @currentCellGeneration[row][column].isAlive
                        numAliveNeighbors += 1
        else
            #This is the simpler method, but it cuts off the edges
            for row in [lowerRowBound..upperRowBound]
                for column in [lowerColumnBound..upperColumnBound]
                    #Skip itself
                    continue if row is cell.row and column is cell.column
                    if @currentCellGeneration[row][column].isAlive
                        numAliveNeighbors += 1


        return numAliveNeighbors

#========================================
#init
#========================================
init = ()->
    game = new Game()

window.onload = init

root = exports ? window
root.Game = Game
