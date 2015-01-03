angular.module('usage', [])
  .controller('usageController', ['$scope', 'charts', function($scope, charts){
    charts.barchart();
    $scope.width = 100;
    $scope.height = 300; // fix but doesn't change until resize window; onload?
  }]);


  //add inputs for min and max cons prod
  //submit button; calls function; socket emit and pass data change to server
  //change values serverside
  //fix functions for graphs in services
  //add socket.io events in graph functions