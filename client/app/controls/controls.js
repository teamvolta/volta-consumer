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

    $scope.appliance = {
      car: 85,
      tv: 27,
      refrigerator: 78,
      laundry: 9
    }

    $scope.submitMin = function() {
      var data = $scope.control;
      if (data.maxConsumption === '') {
        data.maxConsumption = $scope.data.maxConsumption;
      }
      if (data.supplyMarginPercent === '') {
        data.supplyMarginPercent = +$scope.data.supplyMarginPercent.toFixed(4);
      }
      if (data.minConsumption >= data.maxConsumption) {
        alert('Minimum consumption level must be below maximum consumption level');
        return;
      }
      Socket.emit('configChanges', data);
      $('input').val('');
    }

    $scope.submitMax = function() {
      var data = $scope.control;
      if (data.minConsumption === '') {
        data.minConsumption = $scope.data.minConsumption;
      }
      if (data.supplyMarginPercent === '') {
        data.supplyMarginPercent = +$scope.data.supplyMarginPercent.toFixed(4);
      }
      if (data.minConsumption >= data.maxConsumption) {
        alert('Minimum consumption level must be below maximum consumption level');
        return;
      }
      Socket.emit('configChanges', data);
      $('input').val('');
    }

    $scope.submitReserve = function() {
      var data = $scope.control;
      data.supplyMarginPercent = +data.supplyMarginPercent.toFixed(4);

      if (data.minConsumption === '') {
        data.minConsumption = $scope.data.minConsumption;
      }

      if (data.maxConsumption === '') {
        data.maxConsumption = $scope.data.maxConsumption;
      }
      if (data.minConsumption >= data.maxConsumption) {
        alert('Minimum consumption level must be below maximum consumption level');
        return;
      }
      Socket.emit('configChanges', data);
      $('input').val('');
    }

    $scope.controlCar = function() {
      console.log("car")
      $(this).css('background-color',"#ccc")
      var data = $scope.appliance;
      Socket.emit('appChanges', data);

    }

    $scope.controlTV = function() {
      alert("tv")
      var data = $scope.appliance

    }

    $scope.controlRefrigerator = function() {
      alert("ice")
      var data = $scope.appliance

    }

    $scope.controlLaundry = function() {
      alert("wash")
      var data = $scope.appliance

    }

  }]);