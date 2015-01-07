angular.module('usage', [])
  .controller('usageController', ['$scope', 'Socket', function($scope, Socket){
    
    Socket.on('usageView', function(data){
      $scope.$apply(function(){
        $scope.data = data;
      });
    });

    Socket.onBrokerReceipt('usageView', function(data){
      $scope.$apply(function(){
        $scope.receiptData = data;
      });
    });    
  }])