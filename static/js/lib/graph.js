(function() {
    // javascript-astar
    // http://github.com/bgrins/javascript-astar
    // Freely distributable under the MIT License.
    // Includes Binary Heap (with modifications) from Marijn Haverbeke. 
    // http://eloquentjavascript.net/appendix2.html
    define([], function() {
        var GraphNodeType = { 
            OPEN: 1, 
            WALL: 0 
        };

        // Creates a Graph class used in the astar search algorithm.
        function Graph(grid) {
            var nodes = [];

            for (var x = 0; x < grid.length; x++) {
                nodes[x] = [];
                
                for (var y = 0, row = grid[x]; y < row.length; y++) {
                    nodes[x][y] = new GraphNode(x, y, row[y]);
                }
            }

            this.input = grid;
            this.nodes = nodes;
        }

        Graph.prototype.toString = function() {
            var graphString = "\n";
            var nodes = this.nodes;
            var rowDebug, row, y, l;
            for (var x = 0, len = nodes.length; x < len; x++) {
                rowDebug = "";
                row = nodes[x];
                for (y = 0, l = row.length; y < l; y++) {
                    rowDebug += row[y].type + " ";
                }
                graphString = graphString + rowDebug + "\n";
            }
            return graphString;
        };

        function GraphNode(x,y,type) {
            this.data = { };
            this.x = x;
            this.y = y;
            this.pos = {
                x: x, 
                y: y
            };
            this.type = type;
        }

        GraphNode.prototype.toString = function() {
            return "[" + this.x + " " + this.y + "]";
        };

        GraphNode.prototype.isWall = function() {
            return this.type == GraphNodeType.WALL;
        };

        return Graph;
    });
}).call(this);
