var expect = require('chai').expect;
var stubs = require('./stubs.js');

var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:5000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

describe("test for tests", function(){ //mock test, to test gulp and deployment
  it("tests should run", function(){
    var a = 2;
    console.log("testing");  
    expect(a).to.equal(2);
  });

  it("failing tests should stop deployment", function(){
    var a = 2;
    console.log("testing");  
    expect(a).to.equal(3);
  });

});