(function() {

  require.config({
    baseUrl: '/static/js',
    urlArgs: "v=" + (new Date()).getTime(),
    shim: {
      'lib/backbone': {
        deps: ['lib/underscore', 'lib/jquery'],
        exports: 'Backbone'
      }
    }
  });

  require(['require', 'lib/chai', 'lib/mocha'], function(require, chai) {
    var assert, expect, should;
    assert = chai.assert;
    should = chai.should();
    expect = chai.expect;
    mocha.setup('bdd');
    return require(['spec/model-world', 'spec/view-world'], function() {
      return mocha.run();
    });
  });

}).call(this);
