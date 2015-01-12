angular.module('market', [])
  .controller('marketController',['$scope', 'Socket', function($scope, Socket){

    Socket.on('marketView', function(data){
      $scope.$apply(function(){
        $scope.data = data;
      });
    });

    Socket.onBrokerReceipt('marketView', function(data){
      $scope.$apply(function(){
        $scope.receiptData = data;
      });
    });
  }])