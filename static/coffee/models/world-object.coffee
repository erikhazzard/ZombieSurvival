# ===========================================================================
#
# game - world model object (singleton)
#   used across the game to give objects access to the world
#
# ===========================================================================
define(["lib/backbone", "models/world"], (Backbone, World)->
    #Create a world object which will act as a singleton across the app
    world = new World({})

    #Set initial world state
    world.seedWorld()

    return world
)
