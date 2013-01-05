# ===========================================================================
#
# game - app model
#
# ===========================================================================
define(["lib/backbone"], (Backbone)->
    class App extends Backbone.Model
        defaults: {
        }

        initialize: ()=>
            return @

    return App
)
