angular.module('dashboard', [])

.controller('DashboardController', ['$scope', 'Socket', function($scope, Socket) {

  Socket.on('dashboardView', function(data) {
    $scope.$apply(function(){
      $scope.data = data;
    });
  });
}])