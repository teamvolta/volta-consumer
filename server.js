var config = require('./config').development;
var express = require('express');
var app = express();
// Setup reporter
var reporter = new (require('./adminReporter'))();
global.reporter = reporter;
// Setup middleware
app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app);
var consumerId = config.consumerId;
var socket = require('socket.io-client')(config.systemIp);
var simulation = require('./simulation');

// Setup server.
server.listen(config.port);

// Serve admin
app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/public/admin.html')
});

// Serve stats
app.get('/api/stats', function(req, res){
  res.json(reporter.update())
});

console.log("Running the server file");

socket.on('connect', function() {
  consumerId = socket.io.engine.id;
});

// Receive time-slot and duration from system operator to send bids
// {
//   timeslot: UTC ms,
//   duration: ms
// }
socket.on('startBidding', function(data) {
  socket.emit('bid', {
    data: simulation.bid(data),
    consumerId: consumerId
  });
});

// System admin sends back the price for the time-slot
socket.on('receipt', function(receipt) {
 // Do something with price
 console.log(receipt);
});

// System admin keeps track of total consumption of all consumers
setInterval(function () {
  socket.emit('consume', {
    currentConsumption: simulation.currentConsumption(),
    consumerId: config.consumerId
  });
}, 100);
