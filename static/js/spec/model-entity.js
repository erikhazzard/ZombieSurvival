(function() {

  define(['models/entity', 'models/world-object', 'models/world', 'events'], function(Entity, world, World, events) {
    var entity;
    entity = new Entity({});
    world.addEntity(entity);
    describe('Entity Model: Default Params', function() {
      it('should have default param: state', function() {
        return entity.get('state').should.equal('alive');
      });
      it('should have default param: position', function() {
        return entity.get('position').should.not.equal(void 0);
      });
      it('should have default param: position x', function() {
        return entity.get('position').x.should.not.equal(void 0);
      });
      it('should have default param: position y', function() {
        return entity.get('position').y.should.not.equal(void 0);
      });
      return it('should have default param: position y', function() {
        return entity.get('position').y.should.not.equal(void 0);
      });
    });
    describe('Entity Model: getNeighborCells()', function() {
      var cells, columns, neighbors, rows;
      cells = world.get('cells');
      neighbors = entity.getNeighborCells();
      rows = world.get('numberOfRows');
      columns = world.get('numberOfColumns');
      it('should return 8 cells', function() {
        return neighbors.length.should.equal(8);
      });
      it('top left neighbor should loop around, [ROWS,ROWS]', function() {
        return neighbors[0].should.equal(cells[rows - 1][columns - 1]);
      });
      it('top mid neighbor should loop around, [ROWS,0]', function() {
        return neighbors[1].should.equal(cells[rows - 1][0]);
      });
      it('top right neighbor should loop around, [ROWS,1]', function() {
        return neighbors[2].should.equal(cells[rows - 1][1]);
      });
      it('left neighbor should be [0,ROWS]', function() {
        return neighbors[3].should.equal(cells[0][rows - 1]);
      });
      it('right neighbor should be [0,1]', function() {
        return neighbors[4].should.equal(cells[0][1]);
      });
      it('bottom left neighbor should be [1,ROWS]', function() {
        return neighbors[5].should.equal(cells[1][rows - 1]);
      });
      it('bottom mid neighbor should be [1,0]', function() {
        return neighbors[6].should.equal(cells[1][0]);
      });
      it('bottom right neighbor should be [1,1]', function() {
        return neighbors[7].should.equal(cells[1][1]);
      });
      return console.log(neighbors);
    });
    describe('Entity Model: tick()', function() {
      return entity.tick();
    });
    return describe('Entity Model: tick()', function() {
      return entity.tick();
    });
  });

}).call(this);
