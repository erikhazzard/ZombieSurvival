var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(["lib/backbone"], function(Backbone) {
  var World;
  World = (function(_super) {

    __extends(World, _super);

    function World() {
      this.initialize = __bind(this.initialize, this);
      World.__super__.constructor.apply(this, arguments);
    }

    World.prototype.defaults = {
      currentCellGeneration: null,
      canvas: null,
      drawingContext: null,
      tickLength: 100,
      tickNum: 0,
      cellSize: 12,
      numberOfRows: 50,
      numberOfColumns: 50,
      seedProbability: 0.4,
      rules: {
        stayAlive: [2, 3],
        birth: [3]
      },
      toroidal: true,
      showTrails: true
    };

    World.prototype.initialize = function() {
      return this;
    };

    return World;

  })(Backbone.Model);
  return World;
});
