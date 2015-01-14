angular.module('consumer.services', [])
  .factory('Socket', function () {
    var socket = io.connect('http://localhost:8002/client');
    var dataCallbacks = {};
    var brokerReceiptCallbacks = {};
    var systemReceiptCallbacks = {};
    var receiptStorage = [];
    var storage = [];

    socket.on('data', function(data){
      // console.log(data);
      if (storage.length < 10) {
        storage.push(data);
      } else {
        storage.shift();
        storage.push(data);
      }
      
      for (var key in dataCallbacks) {
        dataCallbacks[key](data);
      }
    });

    socket.on('brokerReceipt', function(data) {
      // console.log('brokerReceipt')
      if (data.energy > 0) {
        if (receiptStorage.length < 15) {
          receiptStorage.push(data);
        } else {
          receiptStorage.shift();
          receiptStorage.push(data);
        }
      }

      for (var key in brokerReceiptCallbacks) {
        brokerReceiptCallbacks[key](data);
      } 
    });

    socket.on('systemReceipt', function(data) {
      // console.log('systemReceipt')
      if (data.energy > 0) {
        if (receiptStorage.length < 15) {
          receiptStorage.push(data);
        } else {
          receiptStorage.shift();
          receiptStorage.push(data);
        }
      }

      for (var key in systemReceiptCallbacks) {
        systemReceiptCallbacks[key](data);
      } 
    });

    return {
      receiptStorage: receiptStorage,
      storage: storage,
      on: function (view, callback) {
        dataCallbacks[view] = callback;
      },
      onBrokerReceipt: function(view, callback) {
        brokerReceiptCallbacks[view] = callback;
      },
      onSystemReceipt: function(view, callback) {
        systemReceiptCallbacks[view] = callback;
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          if (callback) {
            callback.apply(socket, args);
          }
        });
      }
    }
  })

  .factory('Appliance', function() {
    var applianceStates = {
      car: false,
      tv: false,
      refrigerator: false,
      laundry: false
    };

    return {
      applianceStates: applianceStates,
      changeState: function(appliance) {
      applianceStates[appliance] = !applianceStates[appliance];
      }
    };
  });
