(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["lib/backbone"], function(Backbone) {
    var Cell;
    Cell = (function(_super) {

      __extends(Cell, _super);

      function Cell() {
        Cell.__super__.constructor.apply(this, arguments);
      }

      Cell.prototype.defaults = {
        isAlive: true,
        color: 'rgba(100,150,200,0.8)',
        resources: 5,
        state: 'alive',
        health: 100
      };

      Cell.prototype.initialize = function() {
        return this.on('change:state', function(state) {
          var health, resources;
          health = 0;
          if (state === 'alive') {
            health = 100;
          } else if (state === 'zombie') {
            health = 40;
          } else {
            health = 0;
          }
          resources = 5;
          return this.set({
            health: health
          });
        });
      };

      Cell.prototype.getColor = function(state) {
        var colors;
        colors = {
          alive: "rgb(100,220,100)",
          dead: "rgb(125,125,125)",
          zombie: "rgb(220,100,100)"
        };
        return colors[state];
      };

      Cell.prototype.getPossibleStates = function() {
        return ['alive', 'dead', 'zombie'];
      };

      return Cell;

    })(Backbone.Model);
    return Cell;
  });

}).call(this);
