var Game, init, root, window,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

if (window) {
  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();
} else {
  window = {};
}

Game = (function() {

  Game.prototype.currentCellGeneration = null;

  Game.prototype.canvas = null;

  Game.prototype.drawingContext = null;

  Game.prototype.tickLength = 100;

  Game.prototype.tickNum = 0;

  Game.prototype.cellSize = 10;

  Game.prototype.numberOfRows = 50;

  Game.prototype.numberOfColumns = 50;

  Game.prototype.seedProbability = 0.4;

  Game.prototype.ruleStayAlive = [2, 3];

  Game.prototype.ruleBirth = [3];

  Game.prototype.toroidal = true;

  Game.prototype.showTrails = false;

  function Game() {
    this.tick = __bind(this.tick, this);    this.createCanvas();
    this.resizeCanvas();
    this.createDrawingContext();
    this.seed();
    this.tick();
  }

  Game.prototype.createCanvas = function() {
    var _this = this;
    this.canvas = document.createElement('canvas');
    this.canvas.addEventListener('click', function(e) {
      var cellColumn, cellRow, column, lowerColumnBound, lowerRowBound, row, upperColumnBound, upperRowBound, x, y, _results;
      x = e.x - _this.canvas.offsetLeft;
      y = e.y - _this.canvas.offsetTop;
      cellColumn = Math.round(Math.floor(x / _this.cellSize));
      cellRow = Math.round(Math.floor(y / _this.cellSize));
      _this.currentCellGeneration[cellRow][cellColumn].isAlive = true;
      lowerRowBound = Math.max(cellRow - 1, 0);
      upperRowBound = Math.min(cellRow + 1, _this.numberOfRows - 1);
      lowerColumnBound = Math.max(cellColumn - 1, 0);
      upperColumnBound = Math.min(cellColumn + 1, _this.numberOfColumns - 1);
      _results = [];
      for (row = lowerRowBound; lowerRowBound <= upperRowBound ? row <= upperRowBound : row >= upperRowBound; lowerRowBound <= upperRowBound ? row++ : row--) {
        _results.push((function() {
          var _results2;
          _results2 = [];
          for (column = lowerColumnBound; lowerColumnBound <= upperColumnBound ? column <= upperColumnBound : column >= upperColumnBound; lowerColumnBound <= upperColumnBound ? column++ : column--) {
            _results2.push(this.currentCellGeneration[row][column].isAlive = true);
          }
          return _results2;
        }).call(_this));
      }
      return _results;
    });
    return document.body.appendChild(this.canvas);
  };

  Game.prototype.resizeCanvas = function() {
    this.canvas.width = this.cellSize * this.numberOfColumns;
    return this.canvas.height = this.cellSize * this.numberOfRows;
  };

  Game.prototype.createDrawingContext = function() {
    return this.drawingContext = this.canvas.getContext('2d');
  };

  Game.prototype.seed = function() {
    var column, row, seedCell, _ref, _ref2;
    this.currentCellGeneration = [];
    for (row = 0, _ref = this.numberOfRows; 0 <= _ref ? row < _ref : row > _ref; 0 <= _ref ? row++ : row--) {
      this.currentCellGeneration[row] = [];
      for (column = 0, _ref2 = this.numberOfColumns; 0 <= _ref2 ? column < _ref2 : column > _ref2; 0 <= _ref2 ? column++ : column--) {
        seedCell = this.createSeedCell(row, column);
        this.currentCellGeneration[row][column] = seedCell;
      }
    }
    return this;
  };

  Game.prototype.createSeedCell = function(row, column) {
    return {
      isAlive: Math.random() < this.seedProbability,
      row: row,
      column: column
    };
  };

  Game.prototype.tick = function() {
    this.drawGrid();
    this.updateCurrentGeneration();
    return requestAnimFrame(this.tick);
  };

  Game.prototype.drawGrid = function() {
    var column, row, _ref, _results;
    _results = [];
    for (row = 0, _ref = this.numberOfRows; 0 <= _ref ? row < _ref : row > _ref; 0 <= _ref ? row++ : row--) {
      _results.push((function() {
        var _ref2, _results2;
        _results2 = [];
        for (column = 0, _ref2 = this.numberOfColumns; 0 <= _ref2 ? column < _ref2 : column > _ref2; 0 <= _ref2 ? column++ : column--) {
          _results2.push(this.drawCell(this.currentCellGeneration[row][column]));
        }
        return _results2;
      }).call(this));
    }
    return _results;
  };

  Game.prototype.drawCell = function(cell) {
    var fillStyle, x, y;
    x = cell.column * this.cellSize;
    y = cell.row * this.cellSize;
    if (cell.isAlive) {
      if (this.showTrails) {
        fillStyle = 'rgba(100,200,100,0.7)';
      } else {
        fillStyle = 'rgb(100,200,100)';
      }
    } else {
      if (this.showTrails) {
        fillStyle = 'rgba(125,125,125,0.5)';
      } else {
        fillStyle = 'rgb(125,125,125)';
      }
    }
    this.drawingContext.strokeStyle = 'rgb(100,100,100)';
    this.drawingContext.strokeRect(x, y, this.cellSize, this.cellSize);
    this.drawingContext.fillStyle = fillStyle;
    return this.drawingContext.fillRect(x, y, this.cellSize, this.cellSize);
  };

  Game.prototype.evolveCell = function(cell) {
    var evolvedCell, numAliveNeighbors;
    evolvedCell = {
      row: cell.row,
      column: cell.column,
      isAlive: cell.isAlive
    };
    numAliveNeighbors = this.countAliveNeighbors(cell);
    if (cell.isAlive && (this.ruleStayAlive.indexOf(numAliveNeighbors) > -1)) {
      evolvedCell.isAlive = true;
    } else if (this.ruleBirth.indexOf(numAliveNeighbors) > -1) {
      evolvedCell.isAlive = true;
    } else {
      evolvedCell.isAlive = false;
    }
    return evolvedCell;
  };

  Game.prototype.updateCurrentGeneration = function() {
    var column, evolvedCell, newCellGeneration, row, _ref, _ref2;
    newCellGeneration = {};
    for (row = 0, _ref = this.numberOfRows; 0 <= _ref ? row < _ref : row > _ref; 0 <= _ref ? row++ : row--) {
      newCellGeneration[row] = [];
      for (column = 0, _ref2 = this.numberOfColumns; 0 <= _ref2 ? column < _ref2 : column > _ref2; 0 <= _ref2 ? column++ : column--) {
        evolvedCell = this.evolveCell(this.currentCellGeneration[row][column]);
        newCellGeneration[row][column] = evolvedCell;
      }
    }
    return this.currentCellGeneration = newCellGeneration;
  };

  Game.prototype.countAliveNeighbors = function(cell) {
    var colBot, colTop, column, curColumn, curRow, lowerColumnBound, lowerRowBound, numAliveNeighbors, row, rowBot, rowTop, upperColumnBound, upperRowBound;
    lowerRowBound = Math.max(cell.row - 1, 0);
    upperRowBound = Math.min(cell.row + 1, this.numberOfRows - 1);
    lowerColumnBound = Math.max(cell.column - 1, 0);
    upperColumnBound = Math.min(cell.column + 1, this.numberOfColumns - 1);
    numAliveNeighbors = 0;
    if (this.toroidal) {
      rowBot = cell.row - 1;
      rowTop = cell.row + 1;
      colBot = cell.column - 1;
      colTop = cell.column + 1;
      for (curRow = rowBot; rowBot <= rowTop ? curRow <= rowTop : curRow >= rowTop; rowBot <= rowTop ? curRow++ : curRow--) {
        for (curColumn = colBot; colBot <= colTop ? curColumn <= colTop : curColumn >= colTop; colBot <= colTop ? curColumn++ : curColumn--) {
          if (curRow === cell.row && curColumn === cell.column) continue;
          row = curRow;
          column = curColumn;
          if (row < 0) {
            row = this.numberOfRows - 1;
          } else if (row > this.numberOfRows) {
            row = 0;
          } else if (row > (this.numberOfRows - 1)) {
            row = 0;
          }
          if (column < 0) {
            column = this.numberOfColumns - 1;
          } else if (column > this.numberOfColumns) {
            column = 0;
          } else if (column > (this.numberOfColumns - 1)) {
            column = 0;
          }
          if (this.currentCellGeneration[row][column].isAlive) {
            numAliveNeighbors += 1;
          }
        }
      }
    } else {
      for (row = lowerRowBound; lowerRowBound <= upperRowBound ? row <= upperRowBound : row >= upperRowBound; lowerRowBound <= upperRowBound ? row++ : row--) {
        for (column = lowerColumnBound; lowerColumnBound <= upperColumnBound ? column <= upperColumnBound : column >= upperColumnBound; lowerColumnBound <= upperColumnBound ? column++ : column--) {
          if (row === cell.row && column === cell.column) continue;
          if (this.currentCellGeneration[row][column].isAlive) {
            numAliveNeighbors += 1;
          }
        }
      }
    }
    return numAliveNeighbors;
  };

  return Game;

})();

init = function() {
  var game;
  return game = new Game();
};

window.onload = init;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

root.Game = Game;
