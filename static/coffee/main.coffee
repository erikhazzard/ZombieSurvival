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
require(["jquery", "models/world", "models/world-object", "views/world", "views/app"], ($, World, world, WorldView, AppView)->
    #app setup
    app = new AppView()

    gameView = new WorldView({ })
    gameView.render()
)
