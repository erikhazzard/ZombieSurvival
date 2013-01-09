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
        state: 'empty',
        occupied: false,
        position: {
          x: 0,
          y: 0
        },
        weight: 1,
        color: 'rgb(100,220,100)'
      };

      Cell.prototype.initialize = function() {
        return this.on('change:state', function(state) {
          return this.set({
            color: this.getColor(state)
          });
        });
      };

      Cell.prototype.getColor = function(state) {
        var colors;
        colors = {
          empty: "rgb(100,220,100)"
        };
        return colors[state];
      };

      return Cell;

    })(Backbone.Model);
    return Cell;
  });

}).call(this);
