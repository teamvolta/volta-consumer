process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config')[process.env.NODE_ENV];
var simulation = new (require('./lib/simulation'))(config);
var app = require('express')();
var server = require('http').Server(app);
server.listen(config.port);
console.log('consumer production server listening on port ' + config.port);


  var socket = require('socket.io-client')(config.consumerIp + '/production');
  var simulationStartTime = Date.now();

  socket.on('connect', function() {
    console.log('Connected to my consumer!');
  });

  var currentProduction = config.min;

  // To change production ouput
  setInterval(function() {
    if(Date.now() > simulationStartTime + config.simulationTime) {
          simulationStartTime = Date.now();
    }
    currentProduction = simulation.timeBasedChange(currentProduction, simulationStartTime, config.min, config.max);
  }, 1000); 

  setInterval(function () {
    socket.emit('production', {
      currentProduction: currentProduction
    });
  }, 1000);
