angular.module('dashboard', [])

.controller('DashboardController', ['$scope', 'Socket', function ($scope, Socket) {
  $scope.consumer = 'Volta';
  $scope.stat = {
    consumerId: '',
    currentConsumption: 0,
    demandBroker: 0,
    supplyBroker: 0,
    demandSystem: 0,
    allotedBySystem: 0,
    allotedByBroker: 0
  };

  Socket.on('connect', function(){
    console.log('socket connected to consumption server');
  });

  //data object recieved from consumption server
  // {
  //   consumerId: consumerId,
  //   currentConsumption: currentConsumption, 
  //   demandBroker: demandBroker,
  //   supplyBroker: supplyBroker,
  //   demandSystem: demandSystem,
  //   allotedBySystem: allotedBySystem,
  //   allotedByBroker: allotedByBroker
  // }
  Socket.on('data', function(data){
    console.log('data received', data);
    $scope.stat.consumerId = data.consumerId.toString();
    $scope.stat.currentConsumption = data.currentConsumption;
    $scope.stat.demandBroker = data.demandBroker;
    $scope.stat.supplyBroker = data.supplyBroker;
    $scope.stat.demandSystem = data.demandSystem;
    $scope.stat.allotedBySystem = data.allotedBySystem;
    $scope.stat.allotedByBroker = data.allotedByBroker;
  });

}]);
