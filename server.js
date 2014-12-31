process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config')[process.env.NODE_ENV].consumption;
var simulation = new (require('./simulation'))(config);
var express = require('express');
var app = express();
// Setup middleware
app.use(express.static(__dirname + '/public'));
// Setup server.
var server = require('http').Server(app);
server.listen(config.port);

var io = require('socket.io')(server);
var system = require('socket.io-client')(config.systemIp);
var broker = require('socket.io-client')(config.brokerIp);

// Setup reporter
var reporter = new (require('./adminReporter'))();
global.reporter = reporter;

var consumerId;
var currentConsumption = 0; 
var demandBroker = 0;
var supplyBroker = 0;
var demandSystem = 0;
var allotedBySystem = 0;
var allotedByBroker = 0;
// Server for consumer production

// Serve admin
app.get('/admin', function (req, res){
  res.sendFile(__dirname + '/public/admin.html');
});

// Serve stats
app.get('/api/stats', function (req, res){
  res.json(reporter.update());
});

console.log('NODE_ENV', process.env.NODE_ENV); //to check whether it's been set to production when deployed

system.on('connect', function () {
  consumerId = system.io.engine.id;
  console.log('Connected to system!');
});

// Receive time-slot and duration from system operator to send bids
// {
//   timeslot: UTC ms,
//   duration: ms
// }
system.on('startBidding', function (data) {
  currentConsumption = simulation.currentConsumption();
  system.emit('bid', {
    // Better name for 'data' property
    data: simulation.bid(data, demandSystem),
    consumerId: consumerId
  });
});


// System admin sends back the price for the time-slot
system.on('receipt', function (receipt) {
 allotedBySystem = receipt.energy;
});


// System admin keeps track of total consumption of all consumers
setInterval(function () {
  system.emit('consume', {
    currentConsumption: currentConsumption,
    consumerId: consumerId
  });
}, 100);



// Broker 
broker.on('connect', function () {
  console.log('Connected to broker!');
});

broker.on('receipt', function (receipt) {
  allotedByBroker = receipt.energy;
  demandSystem = currentConsumption - allotedByBroker;
  // In case the broker allots more than required, consumer should not demand from system
  demandSystem = demandSystem < 0 ? 0 : demandSystem;
});

broker.on('startCollection', function (data) {
  if (supplyBroker) {
    broker.emit('demand', {
      demand: demandBroker,
      consumerId: consumerId
    });
  } else if (demandBroker) {
    broker.emit('supply', {
      supply: supplyBroker,
      consumerId: consumerId
    });
  }
});



// Consumer Production 
io.on('connection', function (socket) {
  socket.on('production', function(data) {
    var net = data.currentProduction - currentConsumption;
    if (net > config.supplyMargin) {
      supplyBroker = net;
      demandBroker = 0;
    } else {
      demandBroker = Math.abs(net);
      supplyBroker = 0;
    }
  });
});
