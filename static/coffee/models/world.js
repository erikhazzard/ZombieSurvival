var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(["lib/backbone", "events"], function(Backbone, events) {
  var World;
  World = (function(_super) {

    __extends(World, _super);

    function World() {
      this.updateRules = __bind(this.updateRules, this);
      this.initialize = __bind(this.initialize, this);
      World.__super__.constructor.apply(this, arguments);
    }

    World.prototype.defaults = {
      currentCellGeneration: null,
      canvas: null,
      drawingContext: null,
      tickLength: 100,
      generationNum: 0,
      cellSize: 12,
      numberOfRows: 42,
      numberOfColumns: 42,
      seedProbability: 0.08,
      zombieProbability: 0.02,
      rules: {
        stayAlive: [2, 3],
        birth: [3]
      },
      toroidal: true,
      showTrails: true
    };

    World.prototype.initialize = function() {
      var _this = this;
      events.on('world:model:changeRuleString', function(ruleString) {
        return _this.updateRules(ruleString);
      });
      return this;
    };

    World.prototype.updateRules = function(ruleString) {
      var birthRules, character, liveRules, newRules, ruleArray, _i, _j, _len, _len2;
      ruleString = ruleString || '';
      if (!ruleString.match(/^[0-9]*\/[0-9]*$/)) return false;
      newRules = {
        stayAlive: [],
        birth: []
      };
      ruleArray = ruleString.split('/');
      liveRules = ruleArray[0].split('');
      birthRules = ruleArray[1].split('');
      for (_i = 0, _len = liveRules.length; _i < _len; _i++) {
        character = liveRules[_i];
        newRules.stayAlive.push(+character);
      }
      for (_j = 0, _len2 = birthRules.length; _j < _len2; _j++) {
        character = birthRules[_j];
        newRules.birth.push(+character);
      }
      this.set({
        rules: newRules
      });
      return true;
    };

    return World;

  })(Backbone.Model);
  return World;
});
