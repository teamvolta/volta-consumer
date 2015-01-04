process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../config')[process.env.NODE_ENV]['consumerProducer'];
var simulation = require('../simulation')(config);
var app = require('express')();
var server = require('http').Server(app);
var socket = require('socket.io-client')(config.consumerIp);
var simulationStartTime = Date.now();

server.listen(config.port);

socket.on('connect', function() {
  console.log('Connected to my consumer');
});

var currentProduction = config.midProduction;

// To change production ouput
setInterval(function() {
  currentProduction = simulation.timeBasedChange(currentProduction, simulationStartTime, config.minProduction, config.maxProduction);
}, 100) 

setInterval(function () {
  socket.emit('production', {
    currentProduction: currentProduction
  });
}, 100);
