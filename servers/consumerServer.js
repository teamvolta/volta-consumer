process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../config')[process.env.NODE_ENV]['consumer'];
var simulation = new (require('../utils/simulation'))(config);
var express = require('express');
var app = express();

// Setup server.
var server = require('http').Server(app);
server.listen(config.port);
console.log('consumer consumption server listening on port ' + config.port);

var discoveryClient = new (require('../utils/discoverClient'))(config);
discoveryClient.register();

var io = require('socket.io')(server);
var doneDiscovering = false;
var system;
var broker;
var account;


discoveryClient.discover('system', 'system', function(err, data) {
  system = require('socket.io-client')(data.ip + '/consumers');
  discoveryClient.discover('system', 'broker', function(err, data) {
    broker = require('socket.io-client')(data.ip + '/market');
    discoveryClient.discover('system', 'accounting', function(err, data) {
      account = require('socket.io-client')(data.ip + '/subscriptions');
      doneDiscovering = true;
    });
  });
});



// // Setup reporter
// var reporter = new (require('./adminReporter'))();
// global.reporter = reporter;

if(doneDiscovering === true) {

  var consumerId;
  var currentConsumption = 0; 
  var demandBroker = 0;
  var supplyBroker = 0;
  var demandSystem = 0;
  var allotedBySystem = 0;
  var allotedByBroker = 0;
  var currentProduction = 0;
  var simulationStartTime = Date.now();
  var maxConsumption = config.max;
  var minConsumption = config.min;
  var supplyMargin = config.supplyMargin;
  var systemPrice = 0;

  console.log('NODE_ENV', process.env.NODE_ENV); //to check whether it's been set to production when deployed


  // System
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
    system.emit('bid', {
      // Better name for 'data' property
      data: simulation.bid(data, demandSystem, simulationStartTime, minConsumption, maxConsumption),
      consumerId: consumerId
    });
  });


  // System admin sends back the price/energy for the time-slot
  system.on('receipt', function (receipt) {
   allotedBySystem = receipt.energy;
   systemPrice = receipt.price;
  });


  // System admin keeps track of total consumption of all consumers
  setInterval(function () {
    currentConsumption = simulation.currentConsumption(simulationStartTime, minConsumption, maxConsumption);
    system.emit('consume', {
      currentConsumption: currentConsumption,
      consumerId: consumerId
    });
  }, 100);



  // Broker 
  broker.on('connect', function () {
    console.log('Connected to broker!');
  });

  broker.on('startCollection', function (timeBlock) {
    if (demandBroker) {
      broker.emit('demand', {
        timeBlock: timeBlock,
        energy: demandBroker,
        consumerId: consumerId
      });
    } else if (supplyBroker) {
      broker.emit('supply', {
        timeBlock: timeBlock,
        energy: supplyBroker,
        consumerId: consumerId
      });
    }
  });


  // Accounting 
  account.on('connect', function () {
    console.log('Connected to account!');
    account.emit('buyer', consumerId);
    account.emit('seller', consumerId);
  })

  account.on('transaction', function(transaction) {
    allotedByBroker = transaction.energy;
    demandSystem = currentConsumption - allotedByBroker;
    // In case the broker allots more than required, consumer should not demand from system
    demandSystem = demandSystem < 0 ? 0 : demandSystem;
  })


  // Consumer Production 
  var productionNsp = io.of('/production');
  productionNsp.on('connection', function (socket) {
    socket.on('production', function(data) {
      currentProduction = data.currentProduction;
      var net = currentProduction - currentConsumption;
      if (net > supplyMargin) {
        supplyBroker = net - supplyMargin;
        supplyBroker = supplyBroker < 0 ? 0 : supplyBroker;
        demandBroker = 0;
      } else {
        demandBroker = Math.abs(net);
        supplyBroker = 0;
      }
    });
  });

  console.log('currentConsumption ' + currentConsumption, 'currentProduction ' + currentProduction);

  // Client
  var clientNsp = io.of('/client');
  // Client will connect to: 'http://localhost:8002/client'
  clientNsp.on('connection', function (socket) {
    console.log('Connected with client!');

    setInterval(function() {
      socket.emit('data', {
        consumerId: consumerId,
        currentConsumption: currentConsumption,
        currentProduction: currentProduction, 
        demandBroker: demandBroker,
        supplyBroker: supplyBroker,
        demandSystem: demandSystem,
        allotedBySystem: allotedBySystem,
        allotedByBroker: allotedByBroker,
        systemPrice: systemPrice
      });
    }, 100);

    socket.on('configChanges', function (data) {
      minConsumption = data.minConsumption;
      maxConsumption = data.maxConsumption;
      supplyMargin = data.supplyMargin;
    });

  });

}
