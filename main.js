var Conway, init,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
})();

Conway = (function() {

  Conway.prototype.currentCellGeneration = null;

  Conway.prototype.cellSize = 10;

  Conway.prototype.numberOfRows = 40;

  Conway.prototype.numberOfColumns = 40;

  Conway.prototype.seedProbability = 0.5;

  Conway.prototype.tickLength = 100;

  Conway.prototype.canvas = null;

  Conway.prototype.drawingContext = null;

  Conway.prototype.tickNum = 0;

  function Conway() {
    this.tick = __bind(this.tick, this);    this.createCanvas();
    this.resizeCanvas();
    this.createDrawingContext();
    this.seed();
    this.tick();
  }

  Conway.prototype.createCanvas = function() {
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

  Conway.prototype.resizeCanvas = function() {
    this.canvas.width = this.cellSize * this.numberOfColumns;
    return this.canvas.height = this.cellSize * this.numberOfRows;
  };

  Conway.prototype.createDrawingContext = function() {
    return this.drawingContext = this.canvas.getContext('2d');
  };

  Conway.prototype.seed = function() {
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

  Conway.prototype.createSeedCell = function(row, column) {
    return {
      isAlive: Math.random() < this.seedProbability,
      row: row,
      column: column
    };
  };

  Conway.prototype.tick = function() {
    this.drawGrid();
    this.updateCurrentGeneration();
    return requestAnimFrame(this.tick);
  };

  Conway.prototype.drawGrid = function() {
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

  Conway.prototype.drawCell = function(cell) {
    var fillStyle, x, y;
    x = cell.column * this.cellSize;
    y = cell.row * this.cellSize;
    if (cell.isAlive) {
      fillStyle = 'rgba(100,200,100,0.7)';
    } else {
      fillStyle = 'rgba(125,125,125,0.5)';
    }
    this.drawingContext.strokeStyle = 'rgb(100,100,100)';
    this.drawingContext.strokeRect(x, y, this.cellSize, this.cellSize);
    this.drawingContext.fillStyle = fillStyle;
    return this.drawingContext.fillRect(x, y, this.cellSize, this.cellSize);
  };

  Conway.prototype.evolveCell = function(cell) {
    var evolvedCell, numAliveNeighbors;
    evolvedCell = {
      row: cell.row,
      column: cell.column,
      isAlive: cell.isAlive
    };
    numAliveNeighbors = this.countAliveNeighbors(cell);
    if (cell.isAlive || numAliveNeighbors === 3) {
      evolvedCell.isAlive = (1 < numAliveNeighbors && numAliveNeighbors < 4);
    }
    return evolvedCell;
  };

  Conway.prototype.updateCurrentGeneration = function() {
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

  Conway.prototype.countAliveNeighbors = function(cell) {
    var colBot, colTop, column, curColumn, curRow, lowerColumnBound, lowerRowBound, numAliveNeighbors, row, rowBot, rowTop, upperColumnBound, upperRowBound;
    lowerRowBound = Math.max(cell.row - 1, 0);
    upperRowBound = Math.min(cell.row + 1, this.numberOfRows - 1);
    lowerColumnBound = Math.max(cell.column - 1, 0);
    upperColumnBound = Math.min(cell.column + 1, this.numberOfColumns - 1);
    numAliveNeighbors = 0;
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
    return numAliveNeighbors;
  };

  return Conway;

})();

init = function() {
  var game;
  return game = new Conway();
};

window.onload = init;
