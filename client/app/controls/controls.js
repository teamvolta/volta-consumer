angular.module('controls', [])
  .controller('controlsController', ['$scope', 'Socket', '$state', function($scope, Socket, $state){

    Socket.on('controlView', function(data) {
      $scope.$apply(function(){
        $scope.data = data;
      });
    });

    $scope.control = {
      minConsumption: '',
      maxConsumption: '',
      supplyMarginPercent: ''
    }

    $scope.submit = function(){
      var data = $scope.control;
      data.supplyMarginPercent = +data.supplyMarginPercent.toFixed(4);

      if (data.minConsumption >= data.maxConsumption) {
        alert('Minimum consumption level must be below maximum consumption level');
        return;
      } else {
        //submit change to server
        Socket.emit('configChanges', data);
        //notify user with confirmation
        alert('Your request has been submitted');
        //redirect to dashboard
        $state.go('dashboard')
      }
    }
  }]);