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

    $scope.use = {
      car: false,
      tv: false,
      refrigerator: false,
      laundry: false
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
      $scope.use.car = !$scope.use.car;
      var data = {};
      for (var key in $scope.use) {
        data[key] = $scope.use[key] ? $scope.appliance[key] : 0;
      }
      Socket.emit('applianceEngaged', data);

    }

    $scope.controlTV = function() {
      $scope.use.tv = !$scope.use.tv;
      var data = {};
      for (var key in $scope.use) {
        data[key] = $scope.use[key] ? $scope.appliance[key] : 0;
      }
      Socket.emit('applianceEngaged', data);

    }

    $scope.controlRefrigerator = function() {
      $scope.use.refrigerator = !$scope.use.refrigerator;
      var data = {};
      for (var key in $scope.use) {
        data[key] = $scope.use[key] ? $scope.appliance[key] : 0;
      }
      Socket.emit('applianceEngaged', data);

    }

    $scope.controlLaundry = function() {
      $scope.use.laundry = !$scope.use.laundry;
      var data = {};
      for (var key in $scope.use) {
        data[key] = $scope.use[key] ? $scope.appliance[key] : 0;
      }
      Socket.emit('applianceEngaged', data);

    }
    
  }]);