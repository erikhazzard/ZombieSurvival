(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["lib/backbone", "models/world-object", "lib/graph", "lib/astar"], function(Backbone, world, Graph, astar) {
    var Entity;
    Entity = (function(_super) {

      __extends(Entity, _super);

      function Entity() {
        Entity.__super__.constructor.apply(this, arguments);
      }

      Entity.prototype.defaults = {
        state: "alive",
        position: {
          x: 0,
          y: 0
        },
        color: 'rgb(255,255,255)',
        desires: {
          shelter: 25,
          resources: 25,
          community: 25
        },
        baseAttributes: {
          health: 100,
          attack: 10,
          defense: 20,
          energy: 100
        },
        attributes: {
          health: 100,
          attack: 10,
          defense: 20,
          energy: 100
        },
        items: [],
        visionRange: 1,
        type: 'human',
        moveQueue: []
      };

      Entity.prototype.getColor = function(state) {
        var colors;
        colors = {
          alive: "rgb(255,255,255)"
        };
        return colors[state];
      };

      Entity.prototype.tick = function() {
        var cells, foundGoal, goal, item, items, moveQueue, targetCellPosition, _i, _len;
        cells = this.getNeighborCells();
        items = world.get('items');
        if (this.get('moveQueue').length < 1) {
          foundGoal = false;
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            targetCellPosition = item.get('position');
            foundGoal = true;
            goal = item;
            break;
          }
          if (foundGoal) {
            moveQueue = this.calculateMoveQueue(this.get('position'), item.get('position'));
            this.set({
              moveQueue: moveQueue
            });
          }
        } else {
          this.moveInQueue(goal);
        }
        return this;
      };

      Entity.prototype.calculateMoveQueue = function(position, cellPosition) {
        var i, iterations, newMoveQueue, stepAmount, xDiff, yDiff;
        xDiff = Math.min(Math.abs(position.x - cellPosition.x), Math.abs(world.get('numberOfColumns') - cellPosition.x));
        yDiff = Math.min(Math.abs(position.y - cellPosition.y), Math.abs(world.get('numberOfRows') - cellPosition.y));
        newMoveQueue = [];
        iterations = xDiff;
        if (yDiff > xDiff) iterations = xDiff;
        for (i = 0; 0 <= iterations ? i <= iterations : i >= iterations; 0 <= iterations ? i++ : i--) {
          stepAmount = {
            x: 0,
            y: 0
          };
          if (position.x < cellPosition.x) {
            stepAmount.x = 1;
          } else if (position.x > cellPosition.x) {
            stepAmount.x = -1;
          }
          if (position.y < cellPosition.y) {
            stepAmount.y = 1;
          } else if (position.y > cellPosition.y) {
            stepAmount.y = -1;
          }
          newMoveQueue.push(stepAmount);
        }
        return newMoveQueue;
      };

      Entity.prototype.moveInQueue = function(item) {
        var items, newX, newY, position, positionDelta, queue;
        queue = this.get('moveQueue');
        position = this.get('position');
        positionDelta = queue.shift();
        this.set({
          moveQueue: queue
        });
        newX = position.x + positionDelta.x;
        newY = position.y + positionDelta.y;
        this.set({
          position: {
            x: newX,
            y: newY
          }
        });
        if (queue.length < 1) {
          if (newX < 0) newX = (world.get('numberOfColumns') - 1) + newX;
          if (newY < 0) newY = (world.get('numberOfRows') - 1) + newY;
          console.log(item);
          item.use(this);
          items = world.get('items');
          items.pop(goal);
        }
        return this;
      };

      Entity.prototype.moveTo = function(cell) {
        var position;
        position = cell.get('position');
        this.set({
          position: {
            x: position.x,
            y: position.y
          }
        });
        return this;
      };

      Entity.prototype.getNeighborCells = function() {
        var cellColumn, cellRow, cells, colBot, colTop, column, curColumn, curRow, lowerColumnBound, lowerRowBound, neighbors, numberOfColumns, numberOfRows, row, rowBot, rowTop, upperColumnBound, upperRowBound, visionRange;
        numberOfRows = world.get('numberOfRows');
        numberOfColumns = world.get('numberOfColumns');
        cellColumn = this.get('position').x;
        cellRow = this.get('position').y;
        visionRange = this.get('visionRange');
        lowerRowBound = Math.max(cellRow - visionRange, 0);
        upperRowBound = Math.min(cellRow + visionRange, numberOfRows - visionRange);
        lowerColumnBound = Math.max(cellColumn - visionRange, 0);
        upperColumnBound = Math.min(cellColumn + visionRange, numberOfColumns - visionRange);
        neighbors = [];
        cells = world.get('cells');
        if (world.get('toroidal')) {
          rowBot = cellRow - visionRange;
          rowTop = cellRow + visionRange;
          colBot = cellColumn - visionRange;
          colTop = cellColumn + visionRange;
          for (curRow = rowBot; rowBot <= rowTop ? curRow <= rowTop : curRow >= rowTop; rowBot <= rowTop ? curRow++ : curRow--) {
            for (curColumn = colBot; colBot <= colTop ? curColumn <= colTop : curColumn >= colTop; colBot <= colTop ? curColumn++ : curColumn--) {
              if (curRow === cellRow && curColumn === cellColumn) continue;
              row = curRow;
              column = curColumn;
              if (row < 0) {
                row = numberOfRows - visionRange;
              } else if (row > numberOfRows) {
                row = 0;
              } else if (row > (numberOfRows - visionRange)) {
                row = 0;
              }
              if (column < 0) {
                column = numberOfColumns - visionRange;
              } else if (column > numberOfColumns) {
                column = 0;
              } else if (column > (numberOfColumns - visionRange)) {
                column = 0;
              }
              neighbors.push(cells[row][column]);
            }
          }
        } else {
          for (row = lowerRowBound; lowerRowBound <= upperRowBound ? row <= upperRowBound : row >= upperRowBound; lowerRowBound <= upperRowBound ? row++ : row--) {
            for (column = lowerColumnBound; lowerColumnBound <= upperColumnBound ? column <= upperColumnBound : column >= upperColumnBound; lowerColumnBound <= upperColumnBound ? column++ : column--) {
              if (row === cellRow && column === cellColumn) continue;
              neighbors.push(cells[row][column]);
            }
          }
        }
        return neighbors;
      };

      return Entity;

    })(Backbone.Model);
    return Entity;
  });

}).call(this);
