process.env.NODE_ENV = process.env.NODE_ENV || 'development';

<<<<<<< HEAD
var config = require('./config')[process.env.NODE_ENV].consumerProduction;
=======
var config = require('./config')[process.env.NODE_ENV]['consumerProduction'];
>>>>>>> fixed gulp errors
var app = require('express')();
var server = require('http').Server(app);
var socket = require('socket.io-client')(config.consumerIp);

server.listen(config.port);

socket.on('connect', function() {
  console.log('Connected to my consumer');
});

var currentProduction = Math.random() * config.midProduction;

setInterval(function () {
  socket.emit('production', {
    currentProduction: currentProduction
  });
}, 100);
