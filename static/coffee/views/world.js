var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(["lib/backbone", "models/cell"], function(Backbone, Cell) {
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
      this.img = {};
      this.img.zombie = new Image();
      this.img.zombie.src = '/static/img/zombie.png';
      this.img.alive = new Image();
      this.img.alive.src = '/static/img/alive.png';
      this.img.alive2 = new Image();
      this.img.alive2.src = '/static/img/alive2.png';
      this.img.resource = new Image();
      this.img.resource.src = '/static/img/resource.png';
      this.img.dead = new Image();
      this.img.dead.src = '/static/img/dead.png';
      this.img.dead.onload = function() {
        return _this.render();
      };
      return this;
    };

    World.prototype.render = function() {
      this.createCanvas();
      this.resizeCanvas();
      this.createDrawingContext();
      this.seed();
      this.tick();
      return this;
    };

    World.prototype.createCanvas = function() {
      var _this = this;
      this.canvas = document.createElement('canvas');
      this.canvas.addEventListener('click', function(e) {
        var cellColumn, cellRow, column, currentCellGeneration, lowerColumnBound, lowerRowBound, row, upperColumnBound, upperRowBound, x, y, _results;
        x = e.x - _this.canvas.offsetLeft;
        y = e.y - _this.canvas.offsetTop;
        cellColumn = Math.round(Math.floor(x / _this.model.get('cellSize')));
        cellRow = Math.round(Math.floor(y / _this.model.get('cellSize')));
        currentCellGeneration = _this.model.get('currentCellGeneration');
        currentCellGeneration[cellRow][cellColumn].set({
          state: 'alive'
        });
        lowerRowBound = Math.max(cellRow - 1, 0);
        upperRowBound = Math.min(cellRow + 1, _this.model.get('numberOfRows') - 1);
        lowerColumnBound = Math.max(cellColumn - 1, 0);
        upperColumnBound = Math.min(cellColumn + 1, _this.model.get('numberOfColumns') - 1);
        _results = [];
        for (row = lowerRowBound; lowerRowBound <= upperRowBound ? row <= upperRowBound : row >= upperRowBound; lowerRowBound <= upperRowBound ? row++ : row--) {
          _results.push((function() {
            var _results2;
            _results2 = [];
            for (column = lowerColumnBound; lowerColumnBound <= upperColumnBound ? column <= upperColumnBound : column >= upperColumnBound; lowerColumnBound <= upperColumnBound ? column++ : column--) {
              _results2.push(currentCellGeneration[row][column].set({
                state: 'alive'
              }));
            }
            return _results2;
          })());
        }
        return _results;
      });
      return document.body.appendChild(this.canvas);
    };

    World.prototype.resizeCanvas = function() {
      this.canvas.width = this.model.get('cellSize') * this.model.get('numberOfColumns');
      return this.canvas.height = this.model.get('cellSize') * this.model.get('numberOfRows');
    };

    World.prototype.createDrawingContext = function() {
      return this.drawingContext = this.canvas.getContext('2d');
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
      var state;
      if (Math.random() < this.model.get('seedProbability')) {
        state = 'alive';
      } else {
        state = 'dead';
      }
      if (Math.random() < this.model.get('zombieProbability')) state = 'zombie';
      if (Math.random() < this.model.get('resourceProbability')) {
        state = 'resource';
      }
      return new Cell({
        state: state,
        row: row,
        column: column
      });
    };

    World.prototype.tick = function() {
      requestAnimFrame(this.tick);
      this.drawGrid();
      return this.updateCurrentGeneration();
    };

    World.prototype.drawGrid = function() {
      var column, row, _ref, _ref2;
      for (row = 0, _ref = this.model.get('numberOfRows'); 0 <= _ref ? row < _ref : row > _ref; 0 <= _ref ? row++ : row--) {
        for (column = 0, _ref2 = this.model.get('numberOfColumns'); 0 <= _ref2 ? column < _ref2 : column > _ref2; 0 <= _ref2 ? column++ : column--) {
          this.drawCell(this.model.get('currentCellGeneration')[row][column]);
        }
      }
      return true;
    };

    World.prototype.drawCell = function(cell) {
      var cellSize, fillStyle, state, x, y;
      cellSize = this.model.get('cellSize');
      x = cell.get('column') * cellSize;
      y = cell.get('row') * cellSize;
      fillStyle = cell.get('color');
      state = cell.get('state');
      if (state === 'alive') if (Math.random() < 0.5) state = 'alive2';
      this.drawingContext.clearRect(x, y, cellSize, cellSize);
      this.drawingContext.drawImage(this.img.dead, x, y, cellSize, cellSize);
      this.drawingContext.drawImage(this.img[state], x, y, cellSize, cellSize);
      return this;
    };

    World.prototype.evolveCell = function(cell) {
      var evolvedCell, health, neighbors, resources, state;
      evolvedCell = new Cell({
        row: cell.get('row'),
        column: cell.get('column'),
        state: cell.get('state'),
        health: cell.get('health'),
        resources: cell.get('resources')
      });
      neighbors = this.countNeighbors(cell);
      state = cell.get('state');
      health = cell.get('health');
      resources = cell.get('resources');
      if (cell.get('state') === 'zombie') {
        if (neighbors.zombie >= (neighbors.alive + 1)) {
          if (neighbors.alive > 1) {
            health = health + ((Math.random() * neighbors.alive) + 10);
          }
        } else if (neighbors.alive > 0) {
          health = health - (Math.random() * neighbors.alive);
        }
        if (neighbors.alive < 1) health = health - 1;
        if (health < 0) state = 'dead';
      } else if (cell.get('state') === 'alive') {
        if (neighbors.zombie) {
          health = health - (neighbors.zombie * neighbors.zombie);
          if (Math.random() < (0.027 + (neighbors.zombie / 8))) state = 'zombie';
        }
        if (neighbors.alive > 6) if (Math.random() < 0.8) state = 'zombie';
        if (neighbors.resource > 0) {
          resources = resources + (25 * neighbors.resource);
        }
        resources = resources - 20 - (neighbors.alive * 2);
        health = health + (resources / 2.0);
        if (health < 0) {
          if (neighbors.zombie >= neighbors.alive) {
            state = 'zombie';
          } else if (neighbors.alive < 7) {
            if (Math.random() < 0.5) state = 'zombie';
          } else {
            state = 'dead';
          }
        }
      } else if (cell.get('state') === 'resource') {
        resources = resources - 5;
        if (neighbors.alive > 0) resources = resources - (neighbors.alive * 2);
        if (resources < 0) state = 'dead';
      } else if (cell.get('state') === 'dead') {
        if (neighbors.alive > (Math.max(neighbors.zombie, 1))) {
          if (Math.random() < 0.007 + (neighbors.alive / 60)) state = 'alive';
        } else {
          if (Math.random() < this.model.get('resourceProbability')) {
            state = 'resource';
          } else {
            if (Math.random() < 0.03) {
              state = 'zombie';
            } else {
              state = 'dead';
            }
          }
        }
      }
      evolvedCell.set({
        state: state,
        health: health,
        resources: resources,
        color: cell.getColor(state)
      });
      return evolvedCell;
    };

    World.prototype.updateCurrentGeneration = function() {
      var column, evolvedCell, generationNum, newCellGeneration, row, _ref, _ref2;
      generationNum = this.model.get('generationNum');
      this.model.set('generationNum', generationNum + 1);
      newCellGeneration = {};
      for (row = 0, _ref = this.model.get('numberOfRows'); 0 <= _ref ? row < _ref : row > _ref; 0 <= _ref ? row++ : row--) {
        newCellGeneration[row] = [];
        for (column = 0, _ref2 = this.model.get('numberOfColumns'); 0 <= _ref2 ? column < _ref2 : column > _ref2; 0 <= _ref2 ? column++ : column--) {
          evolvedCell = this.evolveCell(this.model.get('currentCellGeneration')[row][column]);
          newCellGeneration[row][column] = evolvedCell;
        }
      }
      return this.model.set('currentCellGeneration', newCellGeneration);
    };

    World.prototype.countNeighbors = function(cell) {
      var cellColumn, cellRow, colBot, colTop, column, curColumn, curRow, lowerColumnBound, lowerRowBound, neighbors, numberOfColumns, numberOfRows, row, rowBot, rowTop, upperColumnBound, upperRowBound;
      numberOfRows = this.model.get('numberOfRows');
      numberOfColumns = this.model.get('numberOfColumns');
      cellRow = cell.get('row');
      cellColumn = cell.get('column');
      lowerRowBound = Math.max(cellRow - 1, 0);
      upperRowBound = Math.min(cellRow + 1, numberOfRows - 1);
      lowerColumnBound = Math.max(cellColumn - 1, 0);
      upperColumnBound = Math.min(cellColumn + 1, numberOfColumns - 1);
      neighbors = {
        alive: 0,
        dead: 0,
        resource: 0,
        zombie: 0,
        resourcesTotal: 0
      };
      if (this.model.get('toroidal')) {
        rowBot = cellRow - 1;
        rowTop = cellRow + 1;
        colBot = cellColumn - 1;
        colTop = cellColumn + 1;
        for (curRow = rowBot; rowBot <= rowTop ? curRow <= rowTop : curRow >= rowTop; rowBot <= rowTop ? curRow++ : curRow--) {
          for (curColumn = colBot; colBot <= colTop ? curColumn <= colTop : curColumn >= colTop; colBot <= colTop ? curColumn++ : curColumn--) {
            if (curRow === cellRow && curColumn === cellColumn) continue;
            row = curRow;
            column = curColumn;
            if (row < 0) {
              row = numberOfRows - 1;
            } else if (row > numberOfRows) {
              row = 0;
            } else if (row > (numberOfRows - 1)) {
              row = 0;
            }
            if (column < 0) {
              column = numberOfColumns - 1;
            } else if (column > numberOfColumns) {
              column = 0;
            } else if (column > (numberOfColumns - 1)) {
              column = 0;
            }
            neighbors[this.model.get('currentCellGeneration')[row][column].get('state')] += 1;
            neighbors.resourcesTotal += this.model.get('currentCellGeneration')[row][column].get('resources') || 0;
          }
        }
      } else {
        for (row = lowerRowBound; lowerRowBound <= upperRowBound ? row <= upperRowBound : row >= upperRowBound; lowerRowBound <= upperRowBound ? row++ : row--) {
          for (column = lowerColumnBound; lowerColumnBound <= upperColumnBound ? column <= upperColumnBound : column >= upperColumnBound; lowerColumnBound <= upperColumnBound ? column++ : column--) {
            if (row === cellRow && column === cellColumn) continue;
            neighbors[this.model.get('currentCellGeneration')[row][column].get('state')] += 1;
            neighbors.resourcesTotal += this.model.get('currentCellGeneration')[row][column].get('resourcesTotal');
          }
        }
      }
      return neighbors;
    };

    return World;

  })(Backbone.View);
  return World;
});
