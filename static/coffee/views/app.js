var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(["lib/backbone", "events"], function(Backbone, events) {
  var App;
  App = (function(_super) {

    __extends(App, _super);

    function App() {
      App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.el = 'body';

    App.prototype.events = {
      'change #rules-input': 'updateRules'
    };

    App.prototype.initialize = function() {
      return this;
    };

    App.prototype.render = function() {
      return this;
    };

    App.prototype.updateRules = function(e) {
      return events.trigger('world:model:changeRuleString', $(e.target).val());
    };

    return App;

  })(Backbone.View);
  return App;
});
