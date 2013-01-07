# ===========================================================================
#
# game - app view
#
# ===========================================================================
define(["lib/backbone", "events"], (Backbone, events)->
    class App extends Backbone.View
        el: 'html'
        events: {
            'change #rules-input': 'updateRules'
            'keydown body': 'handleGlobalInput'
        }
        #====================================
        #
        #Methods
        #
        #====================================
        initialize: ()->
            #Properties we'll use later
            return @

        render: ()->
            return @

        updateRules: (e)->
            #The world model will listen for this event to
            #  happen and update its rule with the input value
            #  NOTE: Rules should be in format XY/Z (with the '/')
            events.trigger(
                'world:model:changeRuleString',
                $(e.target).val()
            )


        #Site wide input
        handleGlobalInput: (e)->
            keyCode = e.keyCode
            if keyCode == 37
                #left
                events.trigger('camera:move', {x: -1})
            if keyCode == 38
                #up
                events.trigger('camera:move', {y: -1})
            if keyCode == 39
                #right
                events.trigger('camera:move', {x: 1})
            else if keyCode == 40
                #down
                events.trigger('camera:move', {y: 1})
            return @
    return App
)
