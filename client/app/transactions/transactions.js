
angular.module('transactions', [])
.controller('transactionsController', ['$scope', 'Socket', function($scope, Socket){
  var receiptStorage = Socket.receiptStorage;
  $scope.array = [];


  if (receiptStorage.length) {
    for (var j = receiptStorage.length; j >=0 ; j--) {
      $scope.array.push(receiptStorage[j]);  
    }
  }


  Socket.onBrokerReceipt('transactionView', function(data){
    $scope.$apply(function(){
      if (data.energy > 0) {
        if ($scope.array.length < 15) {
          $scope.array.unshift(data);
        } else {
          $scope.array.pop();
          $scope.array.unshift(data);
        }
      }
    });
  });

  Socket.onSystemReceipt('transactionView', function(data){
    $scope.$apply(function(){
      if (data.energy > 0) {
        if ($scope.array.length < 15) {
          $scope.array.unshift(data);
        } else {
          $scope.array.pop();
          $scope.array.unshift(data);
        }
      }
    });
  });
}])
