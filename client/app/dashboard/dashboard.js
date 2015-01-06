angular.module('dashboard', [])

.controller('DashboardController', ['$scope', 'Socket', function($scope, Socket) {
  Socket.on('dashboardView', function(data) {
    $scope.data = data;
    console.log($scope.data.currentConsumption)
  })
}])