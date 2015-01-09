
angular.module('transactions', [])
.controller('transactionsController', ['$scope', 'Socket', function($scope, Socket){
  var arr = Socket.array;
  $scope.array = [];

  for (var j = 0; j < 15; j++) {
    if(arr[j] && arr[j].energy > 0) {
      $scope.array.push(arr[j]);  
    }
  }


  Socket.onBrokerReceipt('transactionView', function(data){
    $scope.$apply(function(){
      if(data && data.energy > 0) {
        $scope.array.unshift({energy: data.energy,
                              seller: data.seller,
                              price: data.price
                            });
      }
    });
  });

  Socket.onSystemReceipt('transactionView', function(data){
    $scope.$apply(function(){
      if(data && data.energy > 0) {
        $scope.array.unshift({energy: data.energy,
                              seller: data.seller,
                              price: data.price
                            });
      }
    });
  });
}])
