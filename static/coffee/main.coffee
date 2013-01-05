#========================================
#Require Config (load additional libraries)
#========================================
requirejs.config({
    baseUrl: '/static/js',
    shim: {
        'lib/backbone': {
            #These script dependencies should be loaded before loading
            #backbone.js
            deps: ['lib/underscore', 'lib/jquery'],
            #Once loaded, use the global 'Backbone' as the
            #module value.
            exports: 'Backbone'
        }
    }
})

#========================================
#Set everything up
#========================================
require(["jquery", "models/world", "views/world"], ($, worldModel, worldView)->
    game = new worldModel()
    gameView = new worldView({
        model: game
    })
    gameView.render()
)
