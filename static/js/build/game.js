/*
    Erik Hazzard | @enoex | http://vasir.net
*/
(function() {

  GAME.LOGGER = {};

  GAME.LOGGER.options = {
    log_level: 'all'
  };

  GAME.LOGGER.history = {};

  GAME.LOGGER.can_log = function(type) {
    var log_level, return_value;
    return_value = false;
    log_level = GAME.LOGGER.options.log_level;
    if (log_level === 'all' || log_level === true) {
      return_value = true;
    } else if (log_level instanceof Array) {
      if (log_level.indexOf(type) > -1) return_value = true;
    } else if (log_level === null || log_level === void 0 || log_level === 'none' || log_level === false) {
      return_value = false;
    } else {
      if (log_level === type) return_value = true;
    }
    return return_value;
  };

  GAME.LOGGER.log = function(type) {
    var args, cur_date, log_history;
    args = Array.prototype.slice.call(arguments);
    if (!(type != null) || arguments.length === 1) {
      type = 'debug';
      args.splice(0, 0, 'debug');
    }
    if (!GAME.LOGGER.can_log(type)) return false;
    cur_date = new Date();
    args.push({
      'Date': cur_date,
      'Milliseconds': cur_date.getMilliseconds(),
      'Time': cur_date.getTime()
    });
    log_history = GAME.LOGGER.history;
    log_history[type] = log_history[type] || [];
    log_history[type].push(args);
    if (window.console) console.log(Array.prototype.slice.call(args));
    return true;
  };

  GAME.LOGGER.options.log_types = ['debug', 'error', 'info', 'warn'];

  GAME.LOGGER.options.setup_log_types = function() {
    var log_type, _i, _len, _ref, _results;
    GAME.LOGGER.log('logger', 'setupt_log_types()', 'Called setup log types!');
    _ref = GAME.LOGGER.options.log_types;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      log_type = _ref[_i];
      _results.push((function(log_type) {
        return GAME.LOGGER[log_type] = function() {
          var args;
          args = Array.prototype.slice.call(arguments);
          args.splice(0, 0, log_type);
          return GAME.LOGGER.log.apply(null, args);
        };
      })(log_type));
    }
    return _results;
  };

  GAME.LOGGER.options.setup_log_types();

  if (window) {
    if (window.console && GAME.LOGGER.options) {
      if (GAME.LOGGER.options.log_level === 'none' || GAME.LOGGER.options.log_level === null) {
        console.log = function() {
          return {};
        };
      }
    }
    if (!(window.console != null)) {
      window.console = {
        log: function() {
          return {};
        }
      };
    }
    window.onerror = function(msg, url, line) {
      GAME.LOGGER.error(msg, url, line);
      return false;
    };
  }

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  GAME.Models.World = (function(_super) {

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

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  GAME.Views.World = (function(_super) {

    __extends(World, _super);

    function World() {
      this.tick = __bind(this.tick, this);
      World.__super__.constructor.apply(this, arguments);
    }

    World.prototype.initialize = function() {
      this.canvas = null;
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
        currentCellGeneration[cellRow][cellColumn].isAlive = true;
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
              _results2.push(currentCellGeneration[row][column].isAlive = true);
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
      return {
        isAlive: Math.random() < this.model.get('seedProbability'),
        row: row,
        column: column
      };
    };

    World.prototype.tick = function() {
      requestAnimFrame(this.tick);
      this.drawGrid();
      return this.updateCurrentGeneration();
    };

    World.prototype.drawGrid = function() {
      var column, row, _ref, _results;
      _results = [];
      for (row = 0, _ref = this.model.get('numberOfRows'); 0 <= _ref ? row < _ref : row > _ref; 0 <= _ref ? row++ : row--) {
        _results.push((function() {
          var _ref2, _results2;
          _results2 = [];
          for (column = 0, _ref2 = this.model.get('numberOfColumns'); 0 <= _ref2 ? column < _ref2 : column > _ref2; 0 <= _ref2 ? column++ : column--) {
            _results2.push(this.drawCell(this.model.get('currentCellGeneration')[row][column]));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    World.prototype.drawCell = function(cell) {
      var cellSize, fillStyle, x, y;
      cellSize = this.model.get('cellSize');
      x = cell.column * cellSize;
      y = cell.row * cellSize;
      if (cell.isAlive) {
        if (this.showTrails) {
          fillStyle = 'rgba(100,200,100,0.7)';
        } else {
          fillStyle = 'rgb(100,200,100)';
        }
      } else {
        if (this.showTrails) {
          fillStyle = 'rgba(125,125,125,0.8)';
        } else {
          fillStyle = 'rgb(125,125,125)';
        }
      }
      this.drawingContext.strokeStyle = 'rgb(100,100,100)';
      this.drawingContext.strokeRect(x, y, cellSize, cellSize);
      this.drawingContext.fillStyle = fillStyle;
      this.drawingContext.fillRect(x, y, cellSize, cellSize);
      return this;
    };

    World.prototype.evolveCell = function(cell) {
      var evolvedCell, numAliveNeighbors;
      evolvedCell = {
        row: cell.row,
        column: cell.column,
        isAlive: cell.isAlive
      };
      numAliveNeighbors = this.countAliveNeighbors(cell);
      if (cell.isAlive && (this.model.get('rules').stayAlive.indexOf(numAliveNeighbors) > -1)) {
        evolvedCell.isAlive = true;
      } else if (this.model.get('rules').birth.indexOf(numAliveNeighbors) > -1) {
        evolvedCell.isAlive = true;
      } else {
        evolvedCell.isAlive = false;
      }
      return evolvedCell;
    };

    World.prototype.updateCurrentGeneration = function() {
      var column, evolvedCell, newCellGeneration, row, _ref, _ref2;
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

    World.prototype.countAliveNeighbors = function(cell) {
      var colBot, colTop, column, curColumn, curRow, lowerColumnBound, lowerRowBound, numAliveNeighbors, numberOfColumns, numberOfRows, row, rowBot, rowTop, upperColumnBound, upperRowBound;
      numberOfRows = this.model.get('numberOfRows');
      numberOfColumns = this.model.get('numberOfColumns');
      lowerRowBound = Math.max(cell.row - 1, 0);
      upperRowBound = Math.min(cell.row + 1, numberOfRows - 1);
      lowerColumnBound = Math.max(cell.column - 1, 0);
      upperColumnBound = Math.min(cell.column + 1, numberOfColumns - 1);
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
            if (this.model.get('currentCellGeneration')[row][column].isAlive) {
              numAliveNeighbors += 1;
            }
          }
        }
      } else {
        for (row = lowerRowBound; lowerRowBound <= upperRowBound ? row <= upperRowBound : row >= upperRowBound; lowerRowBound <= upperRowBound ? row++ : row--) {
          for (column = lowerColumnBound; lowerColumnBound <= upperColumnBound ? column <= upperColumnBound : column >= upperColumnBound; lowerColumnBound <= upperColumnBound ? column++ : column--) {
            if (row === cell.row && column === cell.column) continue;
            if (this.model.get('currentCellGeneration')[row][column].isAlive) {
              numAliveNeighbors += 1;
            }
          }
        }
      }
      return numAliveNeighbors;
    };

    return World;

  })(Backbone.View);

}).call(this);
(function() {

  requirejs.config({
    shim: {
      'lib/backbone': {
        deps: ['lib/underscore', 'lib/jquery'],
        exports: 'Backbone'
      }
    }
  });

  require(["jquery", "models/world", "views/world"], function($, worldModel, worldView) {
    var game, gameView;
    game = new worldModel();
    gameView = new worldView({
      model: game
    });
    return gameView.render();
  });

}).call(this);
