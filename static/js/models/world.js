(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["logger", "lib/backbone", "models/cell", "models/item", "events"], function(Logger, Backbone, Cell, Item, events) {
    var World;
    World = (function(_super) {

      __extends(World, _super);

      function World() {
        this.updateRules = __bind(this.updateRules, this);
        this.initialize = __bind(this.initialize, this);
        World.__super__.constructor.apply(this, arguments);
      }

      World.prototype.defaults = {
        cells: [],
        tickLength: 100,
        generationNum: 0,
        numberOfRows: 250,
        numberOfColumns: 250,
        seedProbability: 0.2,
        rules: {
          stayAlive: [2, 3],
          birth: [3]
        },
        toroidal: true,
        showTrails: true,
        entities: {
          human: [],
          zombie: []
        },
        items: []
      };

      World.prototype.initialize = function() {
        var _this = this;
        events.on('world:model:changeRuleString', function(ruleString) {
          return _this.updateRules(ruleString);
        });
        return this;
      };

      World.prototype.addEntity = function(entity) {
        var entities;
        entities = this.get('entities');
        entities[entity.get('type')].push(entity);
        this.set({
          entities: entities
        });
        return this;
      };

      World.prototype.seedWorld = function() {
        var cells, column, columns, endTime, row, rows, seedCell, startTime;
        startTime = new Date();
        Logger.log('models/world', 'seedWorld()', 'seed started at: ', startTime);
        cells = [];
        rows = this.get('numberOfRows');
        columns = this.get('numberOfColumns');
        for (row = 0; 0 <= rows ? row < rows : row > rows; 0 <= rows ? row++ : row--) {
          cells[row] = [];
          for (column = 0; 0 <= columns ? column < columns : column > columns; 0 <= columns ? column++ : column--) {
            seedCell = this.createSeedCell(row, column);
            cells[row][column] = seedCell;
          }
        }
        this.set({
          cells: cells
        });
        endTime = new Date();
        Logger.log('models/world', 'seedWorld()', 'seed finished at: ', endTime, 'total time: ' + (startTime.getTime() - endTime.getTime()));
        return this;
      };

      World.prototype.createSeedCell = function(row, column) {
        var cell, color, items, state;
        state = 'empty';
        if (Math.random() < (this.get('seedProbability') / 18)) {
          items = this.get('items');
          items.push(new Item({
            position: {
              x: column,
              y: row
            }
          }));
          this.set({
            items: items
          });
        }
        color = Cell.prototype.getColor(state);
        cell = new Cell({
          state: state,
          color: color,
          row: row,
          column: column,
          position: {
            x: column,
            y: row
          }
        });
        return cell;
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

}).call(this);
