angular.module('consumer.services', [])
  .factory('Socket', function ($rootScope) {
    var socket = io.connect('http://localhost:8002/client');
    var dataCallbacks = {};
    var receiptCallbacks = {};
    socket.on('data', function(data){
      for (var key in dataCallbacks) {
        dataCallbacks[key](data);
      }
    });
    socket.on('brokerReceipt', function(data) {
      console.log(data);
      for (var key in receiptCallbacks) {
        receiptCallbacks[key](data);
      } 
    });
    socket.on('systemReceipt', function(data) {
      console.log(data);
      for (var key in receiptCallbacks) {
        receiptCallbacks[key](data);
      } 
    });

    return {
      on: function (view, callback) {
        dataCallbacks[view] = callback;
      },
      receiptOn: function(view, callback) {
        receiptCallbacks[view] = callback;
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
