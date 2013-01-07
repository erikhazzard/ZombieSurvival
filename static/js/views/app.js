(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["lib/backbone", "events"], function(Backbone, events) {
    var App;
    App = (function(_super) {

      __extends(App, _super);

      function App() {
        App.__super__.constructor.apply(this, arguments);
      }

      App.prototype.el = 'html';

      App.prototype.events = {
        'change #rules-input': 'updateRules',
        'keydown body': 'handleGlobalInput'
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

      App.prototype.handleGlobalInput = function(e) {
        var keyCode;
        keyCode = e.keyCode;
        if (keyCode === 37) {
          events.trigger('camera:move', {
            x: -1
          });
        }
        if (keyCode === 38) {
          events.trigger('camera:move', {
            y: -1
          });
        }
        if (keyCode === 39) {
          events.trigger('camera:move', {
            x: 1
          });
        } else if (keyCode === 40) {
          events.trigger('camera:move', {
            y: 1
          });
        }
        return this;
      };

      return App;

    })(Backbone.View);
    return App;
  });

}).call(this);
