process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../config')[process.env.NODE_ENV]['consumer'];
var simulation = new (require('../utils/simulation'))(config);
var express = require('express');
var app = express();

// Setup server.
var server = require('http').Server(app);
server.listen(config.port);
console.log('consumer consumption server listening on port ' + config.port);

// var b = {discoveryIp:'http://104.40.181.157:8001',
//          ip: 'http://localhost:8010',
//          id: 3,
//          role: 'system',
//          subRole: 'accounting'
//         }
// var a = new (require('../utils/discoverClient'))(b);
// a.register();

var io;
var doneDiscovering = false;
var system;
var broker;
var account;

var consumerId;
var currentConsumption = config.min; 
var demandBroker = 0;
var supplyBroker = 0;
var demandSystem = 1; // To be changed to 0 when accounting works
var allotedBySystem = 0;
var allotedByBroker = 0;
var currentProduction = 0;
var simulationStartTime = Date.now();
var maxConsumption = config.max;
var minConsumption = config.min;
var supplyMarginPercent = config.supplyMargin;
var systemPrice = 0;
  
var discoveryClient = new (require('../utils/discoverClient'))(config);
discoveryClient.register()

discoveryClient.discover('system', 'system', function(err, data) {
  system = require('socket.io-client')(JSON.parse(data.body)[0].ip + '/consumers');
  system.on('connect', function () { 
    consumerId = system.io.engine.id;
    console.log('Connected to system!');
  });

  discoveryClient.discover('system', 'broker', function(err, data) {
    broker = require('socket.io-client')(JSON.parse(data.body)[0].ip + '/market');
    broker.on('connect', function () {
      console.log('Connected to broker!');
    });
    
    discoveryClient.discover('system', 'accounting', function(err, data) {
      account = require('socket.io-client')(JSON.parse(data.body)[0].ip + '/subscriptions');
      account.on('connect', function () {
        console.log('Connected to account!');
        account.emit('buyer', consumerId);
        account.emit('seller', consumerId);
      });
      
      doneDiscovering = true;

    // // Setup reporter
    // var reporter = new (require('./adminReporter'))();
    // global.reporter = reporter;

    // if(doneDiscovering === true) {


      console.log('NODE_ENV', process.env.NODE_ENV); //to check whether it's been set to production when deployed


      // System

      // Receive time-slot and duration from system operator to send bids
      // {
      //   timeslot: UTC ms,
      //   duration: ms
      // }
      system.on('startBidding', function (data) {
        system.emit('bid', {
          // Better name for 'data' property
          consumerId: consumerId,
          data: simulation.bid(data, demandSystem, simulationStartTime, minConsumption, maxConsumption)
        });
      });


      // System admin sends back the price/energy for the time-slot
      system.on('receipt', function (receipt) {
        // console.log('------------ RECEIPT FROM SYSTEM', receipt);
       allotedBySystem = receipt.energy;
       systemPrice = receipt.price;
      });


      // System admin keeps track of total consumption of all consumers
      setInterval(function () {
        // console.log('BEFORE CURRENT CONSUMPTION---- ' + currentConsumption);
        currentConsumption = simulation.currentConsumption(simulationStartTime, minConsumption, maxConsumption);
        console.log('currentConsumption ' + currentConsumption, 'currentProduction ' + currentProduction);
        system.emit('consume', {
          currentConsumption: currentConsumption,
          consumerId: consumerId
        });
      }, 1000);


      // Broker 

      broker.on('startCollection', function (timeBlock) {
        var blockStart = timeBlock.blockStart;
        // console.log('BROKER TIMEBLOCK---------- '+blockStart);
        if (demandBroker) {
          broker.emit('demand', {
            timeBlock: blockStart,
            energy: demandBroker,
            consumerId: consumerId
          });
        } else if (supplyBroker) {
          broker.emit('supply', {
            timeBlock: blockStart,
            energy: supplyBroker,
            consumerId: consumerId
          });
        }
      });


      // Accounting 

      account.on('transaction', function(transaction) {
        allotedByBroker = transaction.energy;
        // console.log('NICE---------',transaction);
        demandSystem = currentConsumption - allotedByBroker;
        // In case the broker allots more than required, consumer should not demand from system
        demandSystem = demandSystem < 0 ? 0 : demandSystem;
      });

      io = require('socket.io')(server);
      // Consumer Production 
      var productionNsp = io.of('/production');
      productionNsp.on('connection', function (socket) {
        socket.on('production', function(data) {
          currentProduction = data.currentProduction;
          var net = currentProduction - currentConsumption;
        // console.log('-----NET---- ' + net);
          supplyMargin = currentConsumption * supplyMarginPercent / 100;
          // console.log('--------------------------- '+ net);
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
        }, 1000);

        socket.on('configChanges', function (data) {
          minConsumption = data.minConsumption;
          maxConsumption = data.maxConsumption;
          supplyMarginPercent = data.supplyMarginPercent;
        });
      });

    });
  });
});

