var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(["lib/backbone"], function(Backbone) {
  var App;
  App = (function(_super) {

    __extends(App, _super);

    function App() {
      App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.initialize = function() {
      return this;
    };

    App.prototype.render = function() {
      return this;
    };

    return App;

  })(Backbone.View);
  return App;
});
