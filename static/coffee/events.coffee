# ===========================================================================
#
# game - events - event aggregator
#
# ===========================================================================
define(["lib/backbone"], (Backbone)->
    events = _.extend({}, Backbone.Events)
    return events
)
