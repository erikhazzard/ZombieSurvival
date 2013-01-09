(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["lib/backbone", "models/cell", "models/entity", "models/world-object", "events"], function(Backbone, Cell, Entity, world, events) {
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
        this.numTicks = 0;
        this.lastTick = new Date();
        events.on('camera:move', function(xyDelta) {
          var newX, newY, x, y;
          x = xyDelta.x || 0;
          y = xyDelta.y || 0;
          newX = _this.camera.x + x;
          newY = _this.camera.y + y;
          if (newX >= 0 && (newX + _this.camera.size) <= (world.get('numberOfColumns'))) {
            _this.camera.x = newX;
          }
          if (newY >= 0 && (newY + _this.camera.size) <= (world.get('numberOfRows'))) {
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
        world.addEntity(new Entity());
        this.drawGrid();
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
          cameraSize = world.get('numberOfColumns');
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
        this.drawItems();
        this.updateEntities();
        if (this.numTicks > 10) {
          this.numTicks = 0;
          console.log('time for 100 ticks: ' + ((new Date().getTime() - this.lastTick.getTime()) / 1000));
          this.lastTick = new Date();
        }
        this.numTicks += 1;
        return this;
      };

      World.prototype.drawGrid = function() {
        var cameraColumn, cameraRow, cells, column, row, _ref, _ref2, _ref3, _ref4;
        cameraColumn = 0;
        cameraRow = 0;
        cells = world.get('cells');
        for (row = _ref = this.camera.y, _ref2 = this.camera.size + this.camera.y; _ref <= _ref2 ? row < _ref2 : row > _ref2; _ref <= _ref2 ? row++ : row--) {
          cameraColumn = 0;
          for (column = _ref3 = this.camera.x, _ref4 = this.camera.size + this.camera.x; _ref3 <= _ref4 ? column < _ref4 : column > _ref4; _ref3 <= _ref4 ? column++ : column--) {
            this.drawObject(cells[row][column], {
              x: cameraColumn,
              y: cameraRow
            });
            cameraColumn += 1;
          }
          cameraRow += 1;
        }
        return true;
      };

      World.prototype.drawItems = function() {
        var item, items, x, y, _i, _len;
        items = world.get('items');
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          x = item.get('position').x - this.camera.x;
          y = item.get('position').y - this.camera.y;
          if ((x >= 0 && x <= this.camera.size) && (y >= 0 && y <= this.camera.size)) {
            this.drawObject(item, {
              x: x,
              y: y
            });
          }
        }
        return this;
      };

      World.prototype.drawObject = function(targetObject, position) {
        var fillStyle, x, y;
        x = position.x * this.cellSize;
        y = position.y * this.cellSize;
        fillStyle = targetObject.get('color');
        this.drawingContext.strokeStyle = 'rgb(100,100,100)';
        this.drawingContext.strokeRect(x, y, this.cellSize, this.cellSize);
        this.drawingContext.fillStyle = fillStyle;
        this.drawingContext.fillRect(x, y, this.cellSize, this.cellSize);
        return this;
      };

      World.prototype.updateEntities = function() {
        var entities, entity, entityTypes, generationNum, key, newEntities, _i, _len;
        generationNum = world.get('generationNum');
        world.set('generationNum', generationNum + 1);
        newEntities = [];
        entities = world.get('entities');
        this.drawEntities();
        for (key in entities) {
          entityTypes = entities[key];
          for (_i = 0, _len = entityTypes.length; _i < _len; _i++) {
            entity = entityTypes[_i];
            entity.tick();
          }
        }
        return this;
      };

      World.prototype.drawEntities = function() {
        var entities, entity, entityTypes, key, x, y, _i, _len;
        entities = world.get('entities');
        for (key in entities) {
          entityTypes = entities[key];
          for (_i = 0, _len = entityTypes.length; _i < _len; _i++) {
            entity = entityTypes[_i];
            x = entity.get('position').x - this.camera.x;
            y = entity.get('position').y - this.camera.y;
            if ((x >= 0 && x <= this.camera.size) && (y >= 0 && y <= this.camera.size)) {
              this.drawObject(entity, {
                x: x,
                y: y
              });
            }
          }
        }
        return this;
      };

      return World;

    })(Backbone.View);
    return World;
  });

}).call(this);
