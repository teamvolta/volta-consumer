var config = require('./config').development;
var consumerId = config.consumerId;
var socket = require('socket.io-client')(config.systemIp);
var simulation = require('./simulation');

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
