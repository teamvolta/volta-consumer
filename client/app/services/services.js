angular.module('consumer.services', [])
  .factory('Socket', function ($rootScope) {
    var socket = io.connect('http://localhost:8002/client');
    var cbTable = {};
    socket.on('data', function(data){
      for (var key in cbTable) {
        cbTable[key](data);
      }
    });

    return {
      on: function (view, callback) {
        cbTable[view] = callback;
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
