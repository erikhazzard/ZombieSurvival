#========================================
#Require Config (load additional libraries)
#========================================
requirejs.config({
    baseUrl: '/static/js',
    #For dev
    urlArgs: "v="+(new Date()).getTime(),
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
require(["jquery", "models/world", "views/world", "views/app"], ($, worldModel, worldView, appView)->
    #app setup
    app = new appView()

    #game setup
    game = new worldModel()
    gameView = new worldView({
        model: game
    })

    #Note: render gets called in initailize
)
