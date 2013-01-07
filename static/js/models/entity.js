(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["lib/backbone"], function(Backbone) {
    var Entity;
    Entity = (function(_super) {

      __extends(Entity, _super);

      function Entity() {
        Entity.__super__.constructor.apply(this, arguments);
      }

      Entity.prototype.defaults = {
        state: "alive",
        position: {
          x: 0,
          y: 0
        },
        color: 'rgb(255,255,255)'
      };

      Entity.prototype.getColor = function(state) {
        var colors;
        colors = {
          alive: "rgb(255,255,255)"
        };
        return colors[state];
      };

      return Entity;

    })(Backbone.Model);
    return Entity;
  });

}).call(this);
