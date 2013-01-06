# ===========================================================================
#
# game - app view
#
# ===========================================================================
define(["lib/backbone", "events"], (Backbone, events)->
    class App extends Backbone.View
        el: 'body'
        events: {
            'change #rules-input': 'updateRules'
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
    return App
)
