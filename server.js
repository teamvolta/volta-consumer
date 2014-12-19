var config = require('./config');
var socket = require('socket.io-client')(config.systemIp);
var simulation = require('./simulation');

socket.on('connect', function() {
  
});

// Receive time-slot and duration from system operator to send bids
// {
//   timeSlot: UTC ms,
//   duration: ms
// }
socket.on('sendBids', function() {
  socket.emit('consumerBid', simulation.currentConsumption());
});

// System admin sends back the price for the time-slot
socket.on('price', function(data) {
 // Do something with price
});

// System admin keeps track of total consumption of all consumers
setInterval( function () {
  socket.emit('currentConsumption', simulation.currentConsumption());
}, 100);
