process.env.node_env = process.env.node_env || "development";

var config = require('./config')[process.env.node_env]['consumerProduction'];
var app = require('express')();
var server = require('http').Server(app);
var socket = require('socket.io-client')(config.systemIp);

server.listen(config.port);

socket.on('connect', function() {
  console.log('connected to my consumer');
});

setInterval(function () {
  socket.emit('production', {
    currentProduction: 10,
  });
}, 100);
