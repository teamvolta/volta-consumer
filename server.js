process.env.node_env = process.env.node_env || "development";

var config = require('./config')[process.env.node_env]['consumption'];
var express = require('express');
var app = express();
// Setup reporter
var reporter = new (require('./adminReporter'))();
global.reporter = reporter;
// Setup middleware
app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app);
var consumerId = config.consumerId;
var io = require("socket.io").listen(8003);
var socket = require('socket.io-client')(config.systemIp);
var simulation = new (require('./simulation'))(config);

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

console.log("node_env", process.env.node_env); //to check whether it's been set to production when deployed

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

var energy;
// System admin sends back the price for the time-slot
socket.on('receipt', function(receipt) {
 energy = receipt.energy;
});


// System admin keeps track of total consumption of all consumers
setInterval(function () {
  socket.emit('consume', {
    currentConsumption: simulation.currentConsumption(energy),
    consumerId: config.consumerId
  });
}, 100);



// Consumer Production stuff
io.on('connection', function(socket) {
  socket.on('production', function(data) {
    console.log(data);
  });
})
