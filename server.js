var config = require('./config').development;
var consumerId = config.consumerId;
var socket = require('socket.io-client')(config.systemIp);
var simulation = require('./simulation');

socket.on('connect', function() {

});

// Receive time-slot and duration from system operator to send bids
// {
//   timeslot: UTC ms,
//   duration: ms
// }
socket.on('startBidding', function(data) {
  socket.emit('bid', {
    bid: simulation.bid(data),
    consumerId: consumerId
  });
});

// System admin sends back the price for the time-slot
socket.on('receipt', function(data) {
 // Do something with price
});

// System admin keeps track of total consumption of all consumers
setInterval(function () {
  socket.emit('consume', {
    currentConsumption: simulation.currentConsumption(),
    consumerId: config.consumerId
  });
}, 100);
