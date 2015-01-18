var expect = require('chai').expect;
var stubs = require('./stubs.js').development;
var simulation = new (require('../consumer-server/lib/simulation'))(stubs);

describe('test for tests', function(){ //mock test, to test gulp and deployment
  it('tests should run', function(){
    var a = 2;
    expect(a).to.equal(2);
  });
});

describe('Simulation', function() {
  it('should not let a number go beyond the min and max values', function() {
    expect(simulation.checkForMinMax(5,3,6)).to.equal(5);
    expect(simulation.checkForMinMax(2,3,6)).to.be.within(3,6);
    expect(simulation.checkForMinMax(7,3,6)).to.be.within(3,6);
  });

});