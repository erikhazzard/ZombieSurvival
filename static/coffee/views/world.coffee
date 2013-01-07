# ===========================================================================
#
# game - world view 
#
# ===========================================================================
define(["lib/backbone", "models/cell", "models/entity", "events"], (Backbone, Cell, Entity, events)->
    class World extends Backbone.View
        #====================================
        #
        #Methods
        #
        #====================================
        initialize: ()->
            #Properties we'll use later
            @canvas = null

            #Limit drawing area
            @camera = {
                x: 0
                y: 0
                size: 50
            }

            #size (in px) of each cell
            @cellSize = 8

            #TODO: Check world size
            
            #Listen for camera move events
            events.on('camera:move', (xyDelta)=>
                #Takes in an object containing the delta change in x and y
                #  directions. e.g., {x: 1, y: 0} or {x: -1, y: -1}
                x = xyDelta.x || 0
                y = xyDelta.y || 0

                #update camera position
                newX = @camera.x + x
                newY = @camera.y + y

                #Can't go below 0 and above bounds of world
                if newX >= 0 and (newX + @camera.size) <= (@model.get('numberOfColumns'))
                    @camera.x = newX

                if newY >= 0 and (newY + @camera.size) <= (@model.get('numberOfRows'))
                    @camera.y = newY
                
                return @camera

            )
            return @

        render: ()->
            @createCanvas()
            @resizeCanvas()
            @createDrawingContext()
            @seed()
            @setupEntities()
            @tick()
            return @

        #Setup canvas
        createCanvas: ()->
            @canvas = document.createElement('canvas')
            document.body.appendChild(@canvas)

        resizeCanvas: ()->
            if @camera and @camera.size
                cameraSize = @camera.size
            else
                cameraSize = @model.get('numberOfColumns')
            @canvas.width = @cellSize * cameraSize
            @canvas.height = @cellSize * cameraSize

        createDrawingContext: ()->
            @drawingContext = @canvas.getContext('2d')

        #--------------------------------
        #
        #Game Tick
        #
        #--------------------------------
        tick: ()=>
            #Tick function - called at every time interval to update
            #  the world
            requestAnimFrame(@tick)
            @drawGrid()
            @updateEntities()
            return @

        #--------------------------------
        #Initialize world
        #--------------------------------
        seed: ()->
            currentCellGeneration = []
            for row in [0...@model.get('numberOfRows')]
                currentCellGeneration[row] = []
                for column in [0...@model.get('numberOfColumns')]
                    seedCell = @createSeedCell(row, column)
                    currentCellGeneration[row][column] = seedCell
            
            #Update the model
            @model.set('currentCellGeneration', currentCellGeneration)

            #Add entities
            return @

        createSeedCell: (row, column)->
            #This sets up the initial state of the world
            if Math.random() < @model.get('seedProbability')
                state = 'resource'
            else
                state = 'empty'

            if Math.random() < (@model.get('seedProbability') / 10)
                state = 'weapon'
            if Math.random() < (@model.get('seedProbability') / 12)
                state = 'shelter'

            color = Cell.prototype.getColor(state)
            cell = new Cell({
                state: state
                color: color
                row: row
                column: column
            })
            return cell

        setupEntities: ()->
            #Create entities in the world ( humans, zombies )
            @model.set({ entities: [ new Entity() ] })

            return @
        
        #--------------------------------
        #
        #Draw functions
        #
        #--------------------------------
        drawGrid: ()->
            #Draw each cell
            cameraColumn = 0
            cameraRow = 0

            for row in [@camera.y...@camera.size+@camera.y]
                #Reset column back to 0
                cameraColumn = 0
                for column in [@camera.x...@camera.size+@camera.x]
                    @drawCell(@model.get('currentCellGeneration')[row][column],
                        { x: cameraColumn, y: cameraRow })
                    cameraColumn += 1

                cameraRow += 1
            return true

        drawCell: (cell, position)->
            #Draws a cell with canvas

            #Calculate x / y, draw cells
            x = position.x * @cellSize
            y = position.y * @cellSize
            #use the cell's color
            fillStyle = cell.get('color')
            
            #draw the cell
            @drawingContext.strokeStyle = 'rgb(100,100,100)'
            @drawingContext.strokeRect(x,y,@cellSize, @cellSize)
            @drawingContext.fillStyle = fillStyle
            @drawingContext.fillRect(x,y,@cellSize,@cellSize)

            return @

        #--------------------------------
        #
        #Update Game / Cell / Entity States
        #
        #--------------------------------
        #This is where the bulk of our game logic lies
        updateEntities: ()->
            generationNum = @model.get('generationNum')
            @model.set('generationNum', generationNum + 1)

            #Loop through all entities ( humans and zombies )
            #  Do this on a copy of entities to avoid collisons
            newEntities = []
            entities = @model.get('entities')

            for entity in entities
                newEntity = @updateEntity(
                    entity
                )
                newEntities.push(newEntity)

            #update the entities
            @model.set({'entities': newEntities})

            @drawEntities()
            return @

        updateEntity: (entity)->
            return entity

        drawEntities: ()->
            #Draws the entities
            entities = @model.get('entities')
            
            for entity in entities
                @drawCell(entity, entity.get('position'))
            return @

    return World
)
