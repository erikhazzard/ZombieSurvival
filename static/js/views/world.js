(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["lib/backbone", "models/cell", "models/entity", "events"], function(Backbone, Cell, Entity, events) {
    var World;
    World = (function(_super) {

      __extends(World, _super);

      function World() {
        this.tick = __bind(this.tick, this);
        World.__super__.constructor.apply(this, arguments);
      }

      World.prototype.initialize = function() {
        var _this = this;
        this.canvas = null;
        this.camera = {
          x: 0,
          y: 0,
          size: 50
        };
        this.cellSize = 8;
        events.on('camera:move', function(xyDelta) {
          var newX, newY, x, y;
          x = xyDelta.x || 0;
          y = xyDelta.y || 0;
          newX = _this.camera.x + x;
          newY = _this.camera.y + y;
          if (newX >= 0 && (newX + _this.camera.size) <= (_this.model.get('numberOfColumns'))) {
            _this.camera.x = newX;
          }
          if (newY >= 0 && (newY + _this.camera.size) <= (_this.model.get('numberOfRows'))) {
            _this.camera.y = newY;
          }
          return _this.camera;
        });
        return this;
      };

      World.prototype.render = function() {
        this.createCanvas();
        this.resizeCanvas();
        this.createDrawingContext();
        this.seed();
        this.setupEntities();
        this.tick();
        return this;
      };

      World.prototype.createCanvas = function() {
        this.canvas = document.createElement('canvas');
        return document.body.appendChild(this.canvas);
      };

      World.prototype.resizeCanvas = function() {
        var cameraSize;
        if (this.camera && this.camera.size) {
          cameraSize = this.camera.size;
        } else {
          cameraSize = this.model.get('numberOfColumns');
        }
        this.canvas.width = this.cellSize * cameraSize;
        return this.canvas.height = this.cellSize * cameraSize;
      };

      World.prototype.createDrawingContext = function() {
        return this.drawingContext = this.canvas.getContext('2d');
      };

      World.prototype.tick = function() {
        requestAnimFrame(this.tick);
        this.drawGrid();
        this.updateEntities();
        return this;
      };

      World.prototype.seed = function() {
        var column, currentCellGeneration, row, seedCell, _ref, _ref2;
        currentCellGeneration = [];
        for (row = 0, _ref = this.model.get('numberOfRows'); 0 <= _ref ? row < _ref : row > _ref; 0 <= _ref ? row++ : row--) {
          currentCellGeneration[row] = [];
          for (column = 0, _ref2 = this.model.get('numberOfColumns'); 0 <= _ref2 ? column < _ref2 : column > _ref2; 0 <= _ref2 ? column++ : column--) {
            seedCell = this.createSeedCell(row, column);
            currentCellGeneration[row][column] = seedCell;
          }
        }
        this.model.set('currentCellGeneration', currentCellGeneration);
        return this;
      };

      World.prototype.createSeedCell = function(row, column) {
        var cell, color, state;
        if (Math.random() < this.model.get('seedProbability')) {
          state = 'resource';
        } else {
          state = 'empty';
        }
        if (Math.random() < (this.model.get('seedProbability') / 10)) {
          state = 'weapon';
        }
        if (Math.random() < (this.model.get('seedProbability') / 12)) {
          state = 'shelter';
        }
        color = Cell.prototype.getColor(state);
        cell = new Cell({
          state: state,
          color: color,
          row: row,
          column: column
        });
        return cell;
      };

      World.prototype.setupEntities = function() {
        this.model.set({
          entities: [new Entity()]
        });
        return this;
      };

      World.prototype.drawGrid = function() {
        var cameraColumn, cameraRow, column, row, _ref, _ref2, _ref3, _ref4;
        cameraColumn = 0;
        cameraRow = 0;
        for (row = _ref = this.camera.y, _ref2 = this.camera.size + this.camera.y; _ref <= _ref2 ? row < _ref2 : row > _ref2; _ref <= _ref2 ? row++ : row--) {
          cameraColumn = 0;
          for (column = _ref3 = this.camera.x, _ref4 = this.camera.size + this.camera.x; _ref3 <= _ref4 ? column < _ref4 : column > _ref4; _ref3 <= _ref4 ? column++ : column--) {
            this.drawCell(this.model.get('currentCellGeneration')[row][column], {
              x: cameraColumn,
              y: cameraRow
            });
            cameraColumn += 1;
          }
          cameraRow += 1;
        }
        return true;
      };

      World.prototype.drawCell = function(cell, position) {
        var fillStyle, x, y;
        x = position.x * this.cellSize;
        y = position.y * this.cellSize;
        fillStyle = cell.get('color');
        this.drawingContext.strokeStyle = 'rgb(100,100,100)';
        this.drawingContext.strokeRect(x, y, this.cellSize, this.cellSize);
        this.drawingContext.fillStyle = fillStyle;
        this.drawingContext.fillRect(x, y, this.cellSize, this.cellSize);
        return this;
      };

      World.prototype.updateEntities = function() {
        var entities, entity, generationNum, newEntities, newEntity, _i, _len;
        generationNum = this.model.get('generationNum');
        this.model.set('generationNum', generationNum + 1);
        newEntities = [];
        entities = this.model.get('entities');
        for (_i = 0, _len = entities.length; _i < _len; _i++) {
          entity = entities[_i];
          newEntity = this.updateEntity(entity);
          newEntities.push(newEntity);
        }
        this.model.set({
          'entities': newEntities
        });
        this.drawEntities();
        return this;
      };

      World.prototype.updateEntity = function(entity) {
        return entity;
      };

      World.prototype.drawEntities = function() {
        var entities, entity, _i, _len;
        entities = this.model.get('entities');
        for (_i = 0, _len = entities.length; _i < _len; _i++) {
          entity = entities[_i];
          this.drawCell(entity, entity.get('position'));
        }
        return this;
      };

      return World;

    })(Backbone.View);
    return World;
  });

}).call(this);
