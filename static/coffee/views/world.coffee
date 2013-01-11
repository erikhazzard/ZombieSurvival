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
            #images
            @img = {}
            @img.zombie = new Image()
            @img.zombie.src = '/static/img/zombie.png'
            @img.alive= new Image()
            @img.alive.src = '/static/img/alive.png'
            @img.alive2 = new Image()
            @img.alive2.src = '/static/img/alive2.png'
            @img.resource = new Image()
            @img.resource.src = '/static/img/resource.png'
            @img.dead = new Image()
            @img.dead.src = '/static/img/dead.png'

            @img.dead.onload = ()=>
                @render()

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
            if Math.random() < @model.get('zombieProbability') 
                state = 'zombie'

            if Math.random() < @model.get('resourceProbability')
                state = 'resource'

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
            
            state = cell.get('state')
            if state == 'alive'
                #Multiple alive sprites
                if Math.random() < 0.5
                    state = 'alive2'
            #Image
            @drawingContext.clearRect(x,y,cellSize,cellSize)
            #draw grass first
            @drawingContext.drawImage(@img.dead, x, y, cellSize, cellSize)
            @drawingContext.drawImage(@img[state], x, y, cellSize, cellSize)
            ##Rect
            ##@drawingContext.strokeStyle = 'rgba(0,50,100,0.5)'
            #@drawingContext.strokeStyle = 'rgb(100,100,100)'
            #@drawingContext.strokeRect(x,y,cellSize, cellSize)
            #@drawingContext.fillStyle = fillStyle
            #@drawingContext.fillRect(x,y,cellSize,cellSize)

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
                health: cell.get('health')
                resources: cell.get('resources')
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
            health = cell.get('health')
            resources = cell.get('resources')

            #----------------------------
            #ZOMBIES
            #----------------------------
            if cell.get('state') == 'zombie'
                #If more zombies than humans, zombies eat human
                if neighbors.zombie >= (neighbors.alive + 1)
                    if neighbors.alive > 1
                        health = health + ((Math.random() * neighbors.alive) + 10)
                else if neighbors.alive > 0
                    health = health - (Math.random() * neighbors.alive)

                if neighbors.alive < 1
                    health = health - 1

                if health < 0
                    state = 'dead'

            #----------------------------
            #ALIVE - HUMANS
            #----------------------------
            else if cell.get('state') == 'alive'
                if neighbors.zombie
                    health = health - (neighbors.zombie * neighbors.zombie)
                    #Chance to get bit and turned to zombie
                    if Math.random() < (0.027 + (neighbors.zombie / 8))
                        state = 'zombie'

                #If there's too many humans, resources are scarce and they
                #  die / turn to zombie / but people kill zombie
                if neighbors.alive > 6
                    if Math.random() < 0.8
                        state = 'zombie'

                if neighbors.resource > 0
                    resources = resources + (25 * neighbors.resource)

                #Natural usage of resources
                resources = resources - 20 - (neighbors.alive * 2)

                #update health if we're still alive
                health = health + (resources / 2.0)

                if health < 0
                    if neighbors.zombie >= neighbors.alive
                        state = 'zombie'

                    else if neighbors.alive < 7
                        if Math.random() < 0.5
                            state = 'zombie'
                    else
                        state = 'dead'

            #----------------------------
            #Resource
            #----------------------------
            else if cell.get('state') == 'resource'
                resources = resources - 5

                if neighbors.alive > 0
                    resources = resources - (neighbors.alive * 2)

                if resources < 0
                    state = 'dead'

            #----------------------------
            #EMPTY
            #----------------------------
            else if cell.get('state') == 'dead'
                if neighbors.alive > ( Math.max(neighbors.zombie, 1) )
                    if Math.random() < 0.007 + (neighbors.alive / 60)
                        #chance for birth
                        state = 'alive'
                else
                    if Math.random() < @model.get('resourceProbability')
                        state = 'resource'
                    else
                        if Math.random() < 0.03
                            state = 'zombie'
                        else
                            state = 'dead'
                
            #Set updated cell
            #----------------------------
            evolvedCell.set({
                state: state
                health: health
                resources: resources
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
                resource: 0
                zombie: 0
                resourcesTotal: 0
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
                        neighbors.resourcesTotal += @model.get('currentCellGeneration')[row][column].get('resources') || 0
            else
                #This is the simpler method, but it cuts off the edges
                for row in [lowerRowBound..upperRowBound]
                    for column in [lowerColumnBound..upperColumnBound]
                        #Skip itself
                        continue if row is cellRow and column is cellColumn
                        neighbors[@model.get('currentCellGeneration')[row][column].get('state')] += 1
                        neighbors.resourcesTotal += @model.get('currentCellGeneration')[row][column].get('resourcesTotal')

            return neighbors

    return World
)
