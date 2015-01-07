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

      var rate = data.supplyMarginPercent;
      switch (rate) {
        case 1:
          data.supplyMarginPercent = data.supplyMarginPercent/100;
          break;
        case 2:
          data.supplyMarginPercent = data.supplyMarginPercent/100;
          break;
        case 3:
          data.supplyMarginPercent = data.supplyMarginPercent/100;
          break;
        case 4:
          data.supplyMarginPercent = data.supplyMarginPercent/100;
          break;
        case 5:
          data.supplyMarginPercent = data.supplyMarginPercent/100;
          break;
        case 6:
          data.supplyMarginPercent = data.supplyMarginPercent/100;
          break;
        case 7:
          data.supplyMarginPercent = data.supplyMarginPercent/100;
          break;
        case 8:
          data.supplyMarginPercent = data.supplyMarginPercent/100;
          break;
        case 9:
          data.supplyMarginPercent = data.supplyMarginPercent/100;
          break;
        case 10:
          data.supplyMarginPercent = data.supplyMarginPercent/100;
          break;
        default:
          data.supplyMarginPercent = +data.supplyMarginPercent.toFixed(4);
      }

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