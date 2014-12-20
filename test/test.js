var expect = require('chai').expect;
var stubs = require('./stubs.js');

var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:5000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};
