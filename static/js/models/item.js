(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["lib/backbone", "events"], function(Backbone, events) {
    var Item;
    Item = (function(_super) {

      __extends(Item, _super);

      function Item() {
        Item.__super__.constructor.apply(this, arguments);
      }

      Item.prototype.defaults = {
        position: {
          x: 0,
          y: 0
        },
        color: 'rgb(200,120,120)'
      };

      Item.prototype.initialize = function() {};

      Item.prototype.getColor = function(state) {
        var colors;
        colors = {
          weapon: "rgb(200,120,120)"
        };
        return colors[state];
      };

      Item.prototype.use = function(entity) {
        entity.updateHealth(20);
        return this.destroy();
      };

      return Item;

    })(Backbone.Model);
    return Item;
  });

}).call(this);
