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
        color: 'rgb(125,125,125)',
        state: 'empty'
      };

      Cell.prototype.getColor = function(state) {
        var colors;
        colors = {
          empty: "rgb(125,125,125)",
          resource: "rgb(100,220,100)",
          weapon: "rgb(100,150,200)",
          shelter: "rgb(50,50,50)"
        };
        return colors[state];
      };

      return Cell;

    })(Backbone.Model);
    return Cell;
  });

}).call(this);