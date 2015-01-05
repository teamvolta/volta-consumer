angular.module('consumer.services', [])
  .factory('Socket', function ($rootScope) {
    var socket = io.connect('http://localhost:8002/client');
    return {
      on: function (eventName, callback) {
        
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  })
  // .factory('script', ['$document', function ($document) {
  //   var script = $document[0].createElement('script');
  //   console.log(script);
  //   return script;
  // }])
  .factory('charts', function () {
    var chart = function (options) {
      return new Highcharts.Chart(options);
    }
    return {
      chart: chart
    }
  })