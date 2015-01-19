process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./consumer-server/config')[process.env.NODE_ENV];
var simulation = new (require('./consumer-server/lib/simulation'))(config);
var generalHelpers = require('./consumer-server/lib/helpers');
var express = require('express');
var app = express();


// Setup server.
var server = require('http').Server(app);
server.listen(config.port);

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
var applianceUse = 0;


var discoveryClient = new (require('./consumer-server/lib/discoverClient'))();
discoveryClient.register(config);

generalHelpers.getIp('system', 'system', '10')
  .then(function(ip) {
    system = require('socket.io-client')(ip + '/consumers');
    system.on('connect', function () { 
      consumerId = system.io.engine.id;
      console.log('Connected to system!');
    });
    return generalHelpers.getIp('system', 'broker', '25');
  })

  .then(function(ip) {
    broker = require('socket.io-client')(ip + '/market');
    broker.on('connect', function () {
      console.log('Connected to broker!');
    });
    return generalHelpers.getIp('system', 'accounting', '5');
  })

  .then(function(ip) {
    account = require('socket.io-client')(ip + '/subscriptions');
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
  })

  .then(function() {
    var io = require('socket.io')(server);
    var productionNsp = io.of('/production');
    var clientNsp = io.of('/client');

    //to check whether it's been set to production when deployed
    console.log('NODE_ENV', process.env.NODE_ENV);



    // SYSTEM --------------------------------------------------------

    system.on('startBidding', function (data) {
      system.emit('bid', {
        consumerId: consumerId,
        data: simulation.bid(data, demandSystem, simulationStartTime, minConsumption, maxConsumption)
      });
    });


    // System admin sends back the price/energy for the time-slot
    system.on('receipt', function (receipt) {
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




    // Broker ------------------------------------------

    broker.on('startCollection', function (timeBlock) {
      var blockStart = timeBlock.blockStart;
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




    // Accounting ---------------------------------

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




    // Consumer Production -----------------------
    productionNsp.on('connection', function (socket) {
      socket.on('production', function(data) {
        currentProduction = data.currentProduction;
        var net = currentProduction - currentConsumption;
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
        var incoming = 0;
        for (var appliance in data) {
          if (data.hasOwnProperty(appliance)) {
            incoming += data[appliance];
          }
        } 
        var diff = applianceUse - incoming;
        applianceUse = incoming;
        if(diff < 0) {
          currentConsumption += Math.abs(diff);
          simulation.changeConsumption(currentConsumption);
          if(currentConsumption > maxConsumption) {
            var increaseMaxBy = currentConsumption - maxConsumption;
            maxConsumption += increaseMaxBy;
          }
        } else {
          currentConsumption -= diff;
          simulation.changeConsumption(currentConsumption);
        }
      });
    });
  })

  .catch(function(err) {
    console.error('ERROR!', err);
  })