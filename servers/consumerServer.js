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
var demandSystem = 0; // To be changed to 0 when accounting works
var allotedBySystem = 0;
var allotedByBroker = 0;
var currentProduction = 0;
var simulationStartTime = Date.now();
var maxConsumption = config.max;
var minConsumption = config.min;
var supplyMarginPercent = config.supplyMargin;
var systemPrice = 0;
var brokerPrice = 0;
var supplyMargin = 0;
  
var discoveryClient = new (require('../utils/discoverClient'))(config);
discoveryClient.register();

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
      console.log('-------NN---------', JSON.parse(data.body)[0].ip + '/subscriptions');
      account = require('socket.io-client')(JSON.parse(data.body)[0].ip + '/subscriptions');
      account.on('connect', function () {
        console.log('Connected to account!');
        account.emit('subscribe', {
          key: 'buyer',
          subkey: consumerId
        });
        account.emit('subscribe', {
          key: 'seller',
          subkey: consumerId
        });
      });
      
      doneDiscovering = true;

      io = require('socket.io')(server);
      var productionNsp = io.of('/production');
      var clientNsp = io.of('/client');
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
        console.log('----SHURUHOJAAYO----------',new Date(data.blockStart));
        system.emit('bid', {
          // Better name for 'data' property
          consumerId: consumerId,
          data: simulation.bid(data, demandSystem, simulationStartTime, minConsumption, maxConsumption)
        });
      });


      // System admin sends back the price/energy for the time-slot
      system.on('receipt', function (receipt) {
       console.log('------------ RECEIPT FROM SYSTEM', receipt);
       allotedBySystem = receipt.energy;
       systemPrice = receipt.price;
       clientNsp.emit('systemReceipt', {
        energy: receipt.energy,
        price: receipt.price,
        time: receipt.block.blockStart,
        seller: receipt.seller
       });
      });


      // System admin keeps track of total consumption of all consumers
      setInterval(function () {
        // console.log('BEFORE CURRENT CONSUMPTION---- ' + currentConsumption);
        if(Date.now() > simulationStartTime + config.simulationTime) {
          simulationStartTime = Date.now();
        }
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
            producerId: consumerId
          });
        }
      });


      // Accounting 

      account.on('transaction', function(receipt) {
        allotedByBroker = receipt.energy;
        brokerPrice = receipt.price;
        console.log('NICE---------',receipt);
        demandSystem = currentConsumption - allotedByBroker;
        // In case the broker allots more than required, consumer should not demand from system
        demandSystem = demandSystem < 0 ? 0 : demandSystem;
        clientNsp.emit('brokerReceipt', {
        energy: allotedByBroker,
        price: brokerPrice,
        time: receipt.block.blockStart,
        seller: receipt.seller
       });
      });

      // Consumer Production 
      productionNsp.on('connection', function (socket) {
        socket.on('production', function(data) {
          currentProduction = data.currentProduction;
          var net = currentProduction - currentConsumption;
          // console.log('-----NET---- ' + net);
          // console.log('--------------------------- '+ net);
          if (net > 0) {
            supplyMargin = net * (supplyMarginPercent/100);
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
      // Client will connect to: 'http://localhost:8002/client'
      clientNsp.on('connection', function (socket) {
        console.log('Connected with client!');

        setInterval(function() {
          socket.emit('data', {
            consumerId: consumerId,
            minConsumption: minConsumption,
            maxConsumption: maxConsumption,
            currentConsumption: currentConsumption,
            currentProduction: currentProduction, 
            demandBroker: demandBroker,
            supplyBroker: supplyBroker,
            demandSystem: demandSystem,
            allotedBySystem: allotedBySystem,
            allotedByBroker: allotedByBroker,
            systemPrice: systemPrice,
            brokerPrice: brokerPrice,
            supplyMarginPercent: supplyMarginPercent
          });
        }, 1000);

        socket.on('configChanges', function (data) {
          console.log('config changes received', data);
          minConsumption = data.minConsumption;
          maxConsumption = data.maxConsumption;
          supplyMarginPercent = data.supplyMarginPercent;
        });

         socket.on('applianceEngaged', function (data) {
          console.log('appliance changes received', data);
          var netApplianceUse = 0;
          for (var appliance in data) {
            if (data.hasOwnProperty(appliance)) {
              netApplianceUse += data[appliance];
            }
          } 
          currentConsumption += netApplianceUse;
        });


      });

    });
  });
});

