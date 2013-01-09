# ===========================================================================
#
# game - world view 
#
# ===========================================================================
define(["lib/backbone", "models/cell", "models/entity", "models/world-object", "events"], (Backbone, Cell, Entity, world, events)->
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

            #tick meta
            @numTicks = 0
            @lastTick = new Date()

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
                if newX >= 0 and (newX + @camera.size) <= (world.get('numberOfColumns'))
                    @camera.x = newX

                if newY >= 0 and (newY + @camera.size) <= (world.get('numberOfRows'))
                    @camera.y = newY
                
                return @camera

            )
            return @

        render: ()->
            @createCanvas()
            @resizeCanvas()
            @createDrawingContext()
            
            #Entities
            world.addEntity(new Entity())

            #Setup the initial grid
            @drawGrid()

            #Game tick
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
                cameraSize = world.get('numberOfColumns')
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
            @drawItems()
            @updateEntities()

            if @numTicks > 10
                @numTicks = 0
                console.log('time for 100 ticks: ' + (
                    (new Date().getTime() - @lastTick.getTime()) / 1000)
                )
                @lastTick = new Date()
            @numTicks += 1

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
            cells = world.get('cells')

            for row in [@camera.y...@camera.size+@camera.y]
                #Reset column back to 0
                cameraColumn = 0
                for column in [@camera.x...@camera.size+@camera.x]
                    @drawObject(cells[row][column],
                        { x: cameraColumn, y: cameraRow })
                    cameraColumn += 1

                cameraRow += 1
            return true

        #--------------------------------
        #items
        #--------------------------------
        drawItems: ()->
            items = world.get('items')
            for item in items
                x = item.get('position').x - @camera.x
                y = item.get('position').y - @camera.y
                if (x >= 0 and x <= @camera.size) and (y >= 0 and y <= @camera.size)
                    @drawObject(item, {x: x, y:y })

            return @

        #--------------------------------
        #draw object helper
        #--------------------------------
        drawObject: (targetObject, position)->
            #Draws a cell with canvas

            #Calculate x / y, draw cells
            x = position.x * @cellSize
            y = position.y * @cellSize
            #use the cell's color
            fillStyle = targetObject.get('color')
            
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
            generationNum = world.get('generationNum')
            world.set('generationNum', generationNum + 1)

            #Loop through all entities ( humans and zombies )
            #  Do this on a copy of entities to avoid collisons
            newEntities = []
            entities = world.get('entities')

            @drawEntities()

            #Update the entity's position
            for key, entityTypes of entities
                for entity in entityTypes
                    entity.tick()

            return @

        drawEntities: ()->
            #Draws the entities
            entities = world.get('entities')
            for key, entityTypes of entities
                for entity in entityTypes
                    #Only draw entities that are in range of the camera
                    x = entity.get('position').x - @camera.x
                    y = entity.get('position').y - @camera.y
                    if (x >= 0 and x <= @camera.size) and (y >= 0 and y <= @camera.size)
                        @drawObject(entity, {x: x, y:y })

            return @

    return World
)
