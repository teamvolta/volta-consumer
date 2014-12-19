var config = require('./config');
var socket = require('socket.io-client')(config.systemIp);

socket.on('connect', function() {
  
});

// Receive time-slot and duration from system operator to send bids
// {
//   timeSlot: UTC ms,
//   duration: ms
// }
socket.on('sendBids', function(data) {
  socket.emit('consumerBid', simulation.getBid(data));
});
